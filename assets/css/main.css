/* main.css – Core layout & CSS variables */
:root {
    --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.15);
    --border-radius-sm: 8px;
    --border-radius-md: 12px;
    --border-radius-lg: 20px;
    --border-radius-xl: 30px;
    --safe-area-top: env(safe-area-inset-top, 0px);
    --safe-area-bottom: env(safe-area-inset-bottom, 0px);
    --safe-area-left: env(safe-area-inset-left, 0px);
    --safe-area-right: env(safe-area-inset-right, 0px);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-sans);
    background: var(--bg-tertiary);
    height: 100vh;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s;
    padding: var(--safe-area-top) var(--safe-area-right) var(--safe-area-bottom) var(--safe-area-left);
}

button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
}

/* App container – flex layout */
.app-container {
    width: 1400px;
    max-width: 100%;
    height: 100%;
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    display: flex;
    overflow: hidden;
    transition: background-color 0.3s, box-shadow 0.3s;
}

/* Offline indicator */
.offline-indicator {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #f44336;
    color: white;
    text-align: center;
    padding: 8px;
    z-index: 10000;
    font-size: 0.9rem;
    animation: slideDown 0.3s;
    padding-top: calc(8px + var(--safe-area-top));
}

.hidden {
    display: none !important;
}
