// main.js
(function() {
    // Global state
    window.deviceId = Utils.generateDeviceId();
    window.currentUser = null;
    window.myName = localStorage.getItem('chatMyName') || 'Anonymous';
    window.messages = [];
    window.replyToMessage = null;
    window.polling = false;

    // Initialize all modules
    ThemeManager.init();
    NotificationManager.init();
    SwipeManager.init();
    OfflineManager.init();

    // Set initial UI
    UI.updateProfile(myName);
    if (myName !== 'Anonymous') {
        document.getElementById('nameInputContainer').classList.add('hidden');
    }

    // Register device
    API.register(deviceId).catch(() => {});

    // Load users
    function loadUsers() {
        if (OfflineManager.isOffline) return;
        API.getUsers(deviceId)
            .then(data => {
                if (data.success) {
                    window.allUsers = data.data;
                    UI.renderUsers(data.data, deviceId);
                }
            });
    }
    loadUsers();
    setInterval(loadUsers, 10000);

    // Feature tree
    FeatureTree.init();

    // Start event handlers
    EventHandlers.init();
})();
