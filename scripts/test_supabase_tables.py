import urllib.request
import json

tables = ['universes', 'projects', 'saves', 'simulations', 'users', 'profiles', 'documents']
for table in tables:
    url = f'https://orotfbqowqoveaetfmop.supabase.co/rest/v1/{table}?select=*&limit=1'
    headers = {
        'apikey': 'sb_publishable_ERGwDuFVEZCYFjn0h1ROHw_f1AQm6eA',
        'Authorization': 'Bearer sb_publishable_ERGwDuFVEZCYFjn0h1ROHw_f1AQm6eA'
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            print(f'Table [{table}]: status {resp.status}, data: {resp.read().decode("utf-8")}')
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f'Table [{table}]: {e.code} -> {body[:100]}')
    except Exception as e:
        print(f'Table [{table}]: {e}')
