/**
 * OrbitLake Supabase Auth & Cloud Universe Storage Integration
 * Connects to Supabase (Google OAuth + Cloud Universe Saving & Syncing)
 */

(function () {
  'use strict';

  const SUPABASE_URL = 'https://orotfbqowqoveaetfmop.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ERGwDuFVEZCYFjn0h1ROHw_f1AQm6eA';

  let supabaseClient = null;
  let currentUser = null;

  // Initialize Supabase Client
  function initSupabase() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      window.__SUPABASE__ = supabaseClient;
      checkSession();
      listenAuthChanges();
    } else {
      console.warn('[OrbitLake Supabase] Waiting for Supabase JS SDK...');
      setTimeout(initSupabase, 200);
    }
  }

  // Check Current Session
  async function checkSession() {
    if (!supabaseClient) return;
    try {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        currentUser = session.user;
        updateUserUI(currentUser);
      } else {
        currentUser = null;
        updateUserUI(null);
      }
    } catch (err) {
      console.error('[OrbitLake Supabase] Session check error:', err);
    }
  }

  // Listen for Auth State Changes
  function listenAuthChanges() {
    if (!supabaseClient) return;
    supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('[OrbitLake Supabase] Auth event:', event);
      if (session && session.user) {
        currentUser = session.user;
        updateUserUI(currentUser);
        // Clean URL if tokens/code are present in hash/query
        if (window.location.hash.includes('access_token=') || window.location.search.includes('code=')) {
          window.history.replaceState(null, '', window.location.pathname);
          showToast(`👋 <strong>${currentUser.user_metadata?.full_name || currentUser.email}</strong>님, 환영합니다! (Google 로그인 완료)`);
        }
      } else {
        currentUser = null;
        updateUserUI(null);
      }
    });
  }

  // Sign In with Google
  async function signInWithGoogle() {
    if (!supabaseClient) {
      alert('Supabase 클라이언트를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    try {
      showToast('🔄 Google 로그인 창으로 이동합니다...');
      const redirectUrl = window.location.origin + window.location.pathname;
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('[OrbitLake Supabase] Sign-in error:', err);
      alert('로그인 오류: ' + (err.message || err));
    }
  }

  // Sign Out
  async function signOut() {
    if (!supabaseClient) return;
    try {
      await supabaseClient.auth.signOut();
      currentUser = null;
      updateUserUI(null);
      showToast('🚪 로그아웃되었습니다.');
      closeUserMenu();
    } catch (err) {
      console.error('[OrbitLake Supabase] Sign-out error:', err);
    }
  }

  // --- Cloud Saving & Syncing ---

  // Get Saved Universes from Supabase
  async function getCloudUniverses() {
    if (!supabaseClient || !currentUser) return [];

    let list = [];

    // 1. Try public.universes table first
    try {
      const { data, error } = await supabaseClient
        .from('universes')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        list = data.map(row => ({
          id: row.id,
          title: row.title || row.data?.title || '이름 없는 우주',
          doc: row.data || row,
          updated_at: row.updated_at
        }));
      }
    } catch (e) {
      // Ignore table error, fallback to metadata
    }

    // 2. Fallback to user_metadata (guaranteed to work without table)
    if (list.length === 0 && currentUser.user_metadata?.saved_universes) {
      list = currentUser.user_metadata.saved_universes;
    }

    return list;
  }

  // Save Current Universe to Supabase
  async function saveCurrentUniverseToCloud() {
    if (!currentUser) {
      showToast('⚠️ Google 로그인이 필요합니다. 먼저 로그인해 주세요.');
      signInWithGoogle();
      return;
    }

    const store = window.__ORBIT_STORE__;
    if (!store) {
      alert('시뮬레이션 스토어를 찾을 수 없습니다.');
      return;
    }

    const doc = store.getState().doc;
    if (!doc) return;

    showToast('☁️ Supabase 클라우드에 저장하는 중...');

    const payload = {
      id: doc.id || ('u-' + Date.now().toString(36)),
      title: doc.title || '나만의 우주',
      doc: doc,
      updated_at: new Date().toISOString()
    };

    let tableSuccess = false;

    // 1. Try saving to table
    try {
      const { error } = await supabaseClient.from('universes').upsert({
        id: payload.id,
        user_id: currentUser.id,
        title: payload.title,
        data: doc,
        updated_at: payload.updated_at
      });
      if (!error) tableSuccess = true;
    } catch (e) {
      tableSuccess = false;
    }

    // 2. Also save to user_metadata for 100% reliability
    try {
      const existing = await getCloudUniverses();
      const updatedList = [payload, ...existing.filter(u => u.id !== payload.id)].slice(0, 50);

      const { data, error } = await supabaseClient.auth.updateUser({
        data: { saved_universes: updatedList }
      });
      if (error && !tableSuccess) throw error;

      if (data?.user) currentUser = data.user;

      showToast(`☁️ <strong>'${payload.title}'</strong> 우주가 Supabase에 저장되었습니다!`);
    } catch (err) {
      console.error('[OrbitLake Supabase] Save error:', err);
      if (tableSuccess) {
        showToast(`☁️ <strong>'${payload.title}'</strong> 우주가 Supabase에 저장되었습니다!`);
      } else {
        alert('클라우드 저장 실패: ' + (err.message || err));
      }
    }
  }

  // Load a Cloud Universe into Simulator
  function loadCloudUniverse(u) {
    const store = window.__ORBIT_STORE__;
    if (!store) return;

    const doc = u.doc || u;
    store.getState().loadDoc(doc);
    showToast(`🌌 <strong>'${u.title || doc.title}'</strong> 우주를 불러왔습니다!`);
    closeCloudModal();
    closeUserMenu();
  }

  // Delete a Cloud Universe
  async function deleteCloudUniverse(id) {
    if (!confirm('이 우주를 클라우드에서 삭제할까요? 되돌릴 수 없습니다.')) return;
    if (!currentUser || !supabaseClient) return;

    try {
      // 1. Delete from table
      try {
        await supabaseClient.from('universes').delete().eq('id', id).eq('user_id', currentUser.id);
      } catch (e) {}

      // 2. Delete from metadata
      const existing = await getCloudUniverses();
      const updatedList = existing.filter(u => u.id !== id);
      const { data } = await supabaseClient.auth.updateUser({
        data: { saved_universes: updatedList }
      });
      if (data?.user) currentUser = data.user;

      showToast('🗑️ 우주가 클라우드에서 삭제되었습니다.');
      renderCloudList();
    } catch (err) {
      console.error('[OrbitLake Supabase] Delete error:', err);
    }
  }

  // --- UI Presentation ---

  function updateUserUI(user) {
    const container = document.getElementById('orbitlake-auth-container');
    if (!container) return;

    if (user) {
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자';
      const avatar = user.user_metadata?.avatar_url || '';

      container.innerHTML = `
        <div class="orbitlake-user-profile" id="orbitlake-user-profile-btn" title="Supabase 계정">
          ${avatar ? `<img src="${avatar}" class="orbitlake-avatar" alt="${name}" />` : `<span class="orbitlake-avatar-initial">${name[0].toUpperCase()}</span>`}
          <span class="orbitlake-username">${name}</span>
          <span class="orbitlake-cloud-badge">☁️</span>
        </div>
        <div class="orbitlake-user-dropdown" id="orbitlake-user-dropdown">
          <div class="user-dropdown-header">
            <strong>${name}</strong>
            <small>${user.email || ''}</small>
          </div>
          <div class="user-dropdown-divider"></div>
          <button class="user-dropdown-item" id="btn-cloud-save">
            <span>☁️</span> 현재 우주 클라우드에 저장
          </button>
          <button class="user-dropdown-item" id="btn-cloud-list">
            <span>📂</span> 내 클라우드 우주 목록
          </button>
          <div class="user-dropdown-divider"></div>
          <button class="user-dropdown-item danger" id="btn-cloud-logout">
            <span>🚪</span> 로그아웃
          </button>
        </div>
      `;

      const profileBtn = document.getElementById('orbitlake-user-profile-btn');
      const dropdown = document.getElementById('orbitlake-user-dropdown');

      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      document.getElementById('btn-cloud-save').addEventListener('click', () => {
        saveCurrentUniverseToCloud();
        closeUserMenu();
      });

      document.getElementById('btn-cloud-list').addEventListener('click', () => {
        openCloudModal();
        closeUserMenu();
      });

      document.getElementById('btn-cloud-logout').addEventListener('click', signOut);

    } else {
      container.innerHTML = `
        <button class="orbitlake-google-btn" id="orbitlake-google-login-btn">
          <svg class="google-icon" viewBox="0 0 24 24" width="16" height="16">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google 로그인
        </button>
      `;

      document.getElementById('orbitlake-google-login-btn').addEventListener('click', signInWithGoogle);
    }
  }

  function closeUserMenu() {
    document.getElementById('orbitlake-user-dropdown')?.classList.remove('open');
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#orbitlake-auth-container')) {
      closeUserMenu();
    }
  });

  // --- Cloud Universes Modal Dialog ---
  function openCloudModal() {
    let modal = document.getElementById('orbitlake-cloud-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'orbitlake-cloud-modal';
      modal.className = 'orbitlake-catalog-backdrop';
      modal.innerHTML = `
        <div class="orbitlake-catalog-dialog" style="max-width: 680px;">
          <div class="catalog-header">
            <div class="catalog-header-title">
              <span style="font-size: 22px;">☁️</span>
              <h2>내 Supabase 클라우드 우주</h2>
            </div>
            <button class="catalog-close-btn" id="cloud-close-x">&times;</button>
          </div>
          <div style="padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; background: rgba(15,23,42,0.4); border-bottom: 1px solid rgba(255,255,255,0.06);">
            <span style="font-size: 13px; color: #94a3b8;">Google 계정에 안전하게 동기화된 우주 목록입니다.</span>
            <button class="orbitlake-tool-btn active" id="btn-modal-save-current">+ 현재 우주 저장</button>
          </div>
          <div id="cloud-universes-list" style="padding: 20px 24px; overflow-y: auto; max-height: 60vh; display: flex; flex-direction: column; gap: 10px;"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCloudModal();
      });
      document.getElementById('cloud-close-x').addEventListener('click', closeCloudModal);
      document.getElementById('btn-modal-save-current').addEventListener('click', async () => {
        await saveCurrentUniverseToCloud();
        renderCloudList();
      });
    }

    renderCloudList();
    modal.classList.add('open');
  }

  function closeCloudModal() {
    document.getElementById('orbitlake-cloud-modal')?.classList.remove('open');
  }

  async function renderCloudList() {
    const listEl = document.getElementById('cloud-universes-list');
    if (!listEl) return;

    listEl.innerHTML = '<div style="text-align: center; color: #64748b; padding: 24px;">불러오는 중...</div>';
    const universes = await getCloudUniverses();

    if (universes.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; color: #64748b; padding: 36px 0;">
          <div style="font-size: 32px; margin-bottom: 10px;">☁️</div>
          <div style="font-size: 15px; color: #94a3b8;">저장된 클라우드 우주가 없습니다.</div>
          <div style="font-size: 12px; margin-top: 6px;">상단의 "+ 현재 우주 저장"을 눌러 지금 우주를 Supabase에 저장해 보세요.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = universes.map(u => {
      const bodiesCount = u.doc?.bodies?.length || 0;
      const dateStr = u.updated_at ? new Date(u.updated_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

      return `
        <div class="cloud-universe-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(15,23,42,0.65); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; transition: all 0.15s ease;">
          <div>
            <div style="font-size: 15px; font-weight: 600; color: #f8fafc;">${u.title || '나만의 우주'}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
              <span>천체 ${bodiesCount}개</span>
              ${dateStr ? ` • <span>${dateStr}</span>` : ''}
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="orbitlake-tool-btn active btn-load-universe" data-id="${u.id}">불러오기</button>
            <button class="orbitlake-tool-btn danger btn-del-universe" data-id="${u.id}" style="color: #f87171;">삭제</button>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.btn-load-universe').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const target = universes.find(u => u.id === id);
        if (target) loadCloudUniverse(target);
      });
    });

    listEl.querySelectorAll('.btn-del-universe').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteCloudUniverse(btn.dataset.id);
      });
    });
  }

  // --- Inject Auth Container in Header ---
  function injectAuthContainer() {
    const navbar = document.querySelector('header.topbar') || document.querySelector('header.lp-nav') || document.querySelector('header');
    if (!navbar) return;

    let container = document.getElementById('orbitlake-auth-container');
    if (container && navbar.contains(container)) return;

    if (container) {
      container.remove();
    }

    container = document.createElement('div');
    container.id = 'orbitlake-auth-container';
    container.className = 'orbitlake-auth-wrap';

    const targetWrap = navbar.querySelector('.topbar-actions') || navbar.querySelector('.lp-nav-right') || navbar.lastElementChild || navbar;
    targetWrap.appendChild(container);

    updateUserUI(currentUser);
  }

  // Helper Toast
  function showToast(msg) {
    if (window.OrbitLake?.openCatalog) {
      let toast = document.getElementById('orbitlake-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'orbitlake-toast';
        toast.className = 'orbitlake-toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = msg;
      toast.classList.add('show');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
    }
  }

  // Auto Hook into OrbitLake saving
  function hookAutoSave() {
    const store = window.__ORBIT_STORE__;
    if (!store) {
      setTimeout(hookAutoSave, 500);
      return;
    }
    // Listen to universe ID changes or manual saves
    store.subscribe((state, prevState) => {
      if (currentUser && state.doc && prevState.doc && state.doc.id !== prevState.doc.id) {
        // Universe changed
      }
    });
  }

  // Initialize on Load
  const observer = new MutationObserver(() => {
    injectAuthContainer();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSupabase();
      injectAuthContainer();
      hookAutoSave();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    initSupabase();
    injectAuthContainer();
    hookAutoSave();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.OrbitLakeSupabase = {
    client: () => supabaseClient,
    signInWithGoogle: signInWithGoogle,
    signOut: signOut,
    saveUniverse: saveCurrentUniverseToCloud,
    getUniverses: getCloudUniverses,
    openCloudModal: openCloudModal
  };

  console.log('[OrbitLake Supabase] Integration script loaded. Ready for Google Auth & Cloud Saves.');
})();
