// notifications.js
const NotificationManager = {
    soundEnabled: localStorage.getItem('sound') !== 'false',
    notificationsEnabled: localStorage.getItem('notifications') !== 'false',

    init() {
        if (this.notificationsEnabled && 'Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    },

    playSound() {
        if (!this.soundEnabled) return;
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Sound not available');
        }
    },

    notify(title, body) {
        if (this.notificationsEnabled && Notification.permission === 'granted') {
            new Notification(title, { body, icon: 'https://via.placeholder.com/48' });
        }
    },

    toggleSound(enabled) {
        this.soundEnabled = enabled;
        localStorage.setItem('sound', enabled);
    },

    toggleNotifications(enabled) {
        this.notificationsEnabled = enabled;
        localStorage.setItem('notifications', enabled);
        if (enabled && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }
};

window.NotificationManager = NotificationManager;
