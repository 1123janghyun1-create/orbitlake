import os

path = r"c:\Users\1123j\OneDrive\Desktop\orbitlake\dist\assets\orbitlake-enhancements.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_fn = "  // Observe DOM for dynamic element creation (React SPA)"
new_fn = """  // --- Cinema / Capture Live Planet Switcher ---
  function updateCaptureHudSwitcher() {
    const hud = document.querySelector('.capture-hud');
    if (!hud) return;

    if (!hud.querySelector('.capture-planet-switcher')) {
      const store = window.__ORBIT_STORE__;
      if (!store) return;
      const state = store.getState();
      const bodies = state.doc?.bodies || [];
      const currentSelectedId = state.selectedId;

      const switcherWrap = document.createElement('div');
      switcherWrap.className = 'capture-planet-switcher';
      switcherWrap.innerHTML = `
        <label>🎬 촬영 행성:</label>
        <select class="capture-planet-select" id="capture-planet-select">
          ${bodies.map(b => `<option value="${b.id}" ${b.id === currentSelectedId ? 'selected' : ''}>${b.name}</option>`).join('')}
        </select>
      `;

      const sel = switcherWrap.querySelector('select');
      sel.addEventListener('change', (e) => {
        const targetId = e.target.value;
        const targetBody = bodies.find(b => b.id === targetId);
        store.getState().select(targetId);
        showToast(`🎬 <strong>${targetBody?.name || '행성'}</strong>으로 부드럽게 이동합니다.`);
      });

      // Insert right after the recording bar
      const bar = hud.querySelector('.capture-bar');
      if (bar && bar.nextSibling) {
        hud.insertBefore(switcherWrap, bar.nextSibling);
      } else {
        hud.appendChild(switcherWrap);
      }
    } else {
      // Sync selected value
      const sel = hud.querySelector('.capture-planet-select');
      const store = window.__ORBIT_STORE__;
      if (sel && store) {
        const currentSelectedId = store.getState().selectedId;
        if (currentSelectedId && sel.value !== currentSelectedId) {
          sel.value = currentSelectedId;
        }
      }
    }
  }

  // Observe DOM for dynamic element creation (React SPA)"""

assert old_fn in content, "old_fn not found"
content = content.replace(old_fn, new_fn, 1)

# Also ensure updateCaptureHudSwitcher is called in mutation observer
content = content.replace("injectEnhancementUI();", "injectEnhancementUI(); updateCaptureHudSwitcher();")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully added Cinema Live Planet Switcher to orbitlake-enhancements.js")
