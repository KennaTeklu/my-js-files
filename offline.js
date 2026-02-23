// offline.js
const OfflineManager = {
    isOffline: !navigator.onLine,
    pendingMessages: [],
    indicator: document.getElementById('offlineIndicator'),

    init() {
        window.addEventListener('online', () => this.updateStatus());
        window.addEventListener('offline', () => this.updateStatus());
        this.updateStatus();
    },

    updateStatus() {
        this.isOffline = !navigator.onLine;
        this.indicator.classList.toggle('hidden', !this.isOffline);
        if (!this.isOffline && this.pendingMessages.length > 0) {
            this.sendPending();
        }
    },

    queueMessage(to, text) {
        this.pendingMessages.push({ to, text });
    },

    async sendPending() {
        while (this.pendingMessages.length > 0) {
            const msg = this.pendingMessages[0];
            try {
                await API.sendMessage(deviceId, msg.to, msg.text);
                this.pendingMessages.shift();
            } catch (err) {
                console.warn('Failed to send pending message, will retry later');
                break;
            }
        }
    }
};

window.OfflineManager = OfflineManager;
