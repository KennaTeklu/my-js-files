// theme.js
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'auto';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateToggleIcon(savedTheme);
        
        document.getElementById('themeToggle').addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
            this.applyTheme(next);
        });

        document.getElementById('themeSelect')?.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleIcon(theme);
        if (document.getElementById('themeSelect')) {
            document.getElementById('themeSelect').value = theme;
        }
    },

    updateToggleIcon(theme) {
        const toggle = document.getElementById('themeToggle');
        if (theme === 'dark') toggle.innerHTML = '<i class="fas fa-sun"></i>';
        else if (theme === 'auto') toggle.innerHTML = '<i class="fas fa-circle-half-stroke"></i>';
        else toggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
};

window.ThemeManager = ThemeManager;
