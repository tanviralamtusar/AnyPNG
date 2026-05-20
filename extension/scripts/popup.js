const SUPABASE_URL = "https://yknravxmhhwgwccflefc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbnJhdnhtaGh3Z3djY2ZsZWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDE1NzksImV4cCI6MjA4NzYxNzU3OX0.8crtZn3ZHqqaCg0VKLuhSzjNv0Kxf9vPolAfCwB_edI";

async function checkSession() {
    // Optionally load theme before navigating
    const { theme } = await chrome.storage.local.get('theme');
    if (theme === 'light') document.body.classList.add('light-theme');

    let { supabaseSession } = await chrome.storage.local.get('supabaseSession');
    
    if (!supabaseSession) {
        window.location.replace('login.html');
        return;
    }

    if (supabaseSession.refresh_token) {
        try {
            const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'apikey': SUPABASE_ANON_KEY,
                    'x-client-info': 'anypng-extension'
                },
                body: JSON.stringify({ refresh_token: supabaseSession.refresh_token })
            });
            
            if (res.ok) {
                const newSession = await res.json();
                supabaseSession = { ...supabaseSession, ...newSession };
                await chrome.storage.local.set({ supabaseSession });
                window.location.replace('dashboard.html');
            } else {
                await chrome.storage.local.remove('supabaseSession');
                window.location.replace('login.html');
            }
        } catch (e) {
            window.location.replace('login.html');
        }
    } else {
        window.location.replace('dashboard.html');
    }
}

document.addEventListener('DOMContentLoaded', checkSession);
