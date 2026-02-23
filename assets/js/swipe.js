// swipe.js
const SwipeManager = {
    minDistance: 50,
    touchStartX: 0,
    touchEndX: 0,

    init() {
        document.querySelectorAll('[data-swipeable="true"]').forEach(el => {
            el.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            el.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(el);
            }, { passive: true });
        });
    },

    handleSwipe(el) {
        const diff = this.touchEndX - this.touchStartX;
        if (Math.abs(diff) < this.minDistance) return;

        if (el.id === 'sidebar') {
            if (diff > 0) el.classList.add('open');
            else el.classList.remove('open');
        } else if (el.id === 'rightPanel') {
            if (diff < 0) el.classList.add('open');
            else el.classList.remove('open');
        }
    }
};

window.SwipeManager = SwipeManager;
