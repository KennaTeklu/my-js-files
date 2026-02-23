// main.js – App entry point

(function() {
    // Global state
    window.deviceId = Utils.generateDeviceId();
    window.currentUser = null;
    window.myName = localStorage.getItem('chatMyName') || 'Anonymous';
    window.messages = [];
    window.replyToMessage = null;
    window.polling = false;
    window.allUsers = [];
    window.readReceiptsEnabled = localStorage.getItem('readReceipts') !== 'false';
    window.typingIndicatorEnabled = localStorage.getItem('typingIndicator') !== 'false';

    // Initialize all modules
    ThemeManager.init();
    NotificationManager.init();
    SwipeManager.init();
    OfflineManager.init();

    // Set initial UI
    UI.updateProfile(window.myName);
    if (window.myName !== 'Anonymous') {
        document.getElementById('nameInputContainer').classList.add('hidden');
    }

    // Register device
    API.register(window.deviceId).catch(() => {});

    // Load users and start polling
    function loadUsers() {
        if (OfflineManager.isOffline) return;
        API.getUsers(window.deviceId)
            .then(data => {
                if (data.success) {
                    window.allUsers = data.data;
                    UI.renderUsers(data.data, window.deviceId);
                    UI.renderRecentChats(data.data);
                }
            });
    }
    loadUsers();
    setInterval(loadUsers, 10000);

    // Feature tree
    FeatureTree.init();

    // Start event handlers
    EventHandlers.init();

    // Polling for messages (will be started when a user is selected)
    window.startPolling = function() {
        if (window.polling) return;
        window.polling = true;
        const interval = setInterval(async () => {
            if (!window.currentUser) {
                clearInterval(interval);
                window.polling = false;
                return;
            }
            try {
                const data = await API.getMessages(window.deviceId, window.lastMessageTime || new Date(0).toISOString());
                if (data.success && data.data.length > 0) {
                    // Filter new messages not already in UI
                    const newMessages = data.data.filter(m => !window.messages.some(ex => ex.id === m.id));
                    if (newMessages.length > 0) {
                        window.messages.push(...newMessages);
                        UI.appendMessages(newMessages, window.deviceId, window.currentUser.name);
                        // Update last message time
                        const latest = newMessages[newMessages.length - 1].timestamp;
                        if (latest > window.lastMessageTime) window.lastMessageTime = latest;
                        // Notify
                        if (newMessages.some(m => m.from !== window.deviceId)) {
                            NotificationManager.playSound();
                            NotificationManager.notify(`New message from ${window.currentUser.name}`, newMessages[0].text);
                        }
                    }
                }
            } catch (err) {
                console.warn('Polling error', err);
            }
        }, 3000);
    };

    // Global function to refresh messages (used after reactions, edits, etc.)
    window.loadMessages = async function() {
        if (!window.currentUser) return;
        try {
            const data = await API.getMessages(window.deviceId, window.lastMessageTime || new Date(0).toISOString());
            if (data.success && data.data.length > 0) {
                const newMessages = data.data.filter(m => !window.messages.some(ex => ex.id === m.id));
                if (newMessages.length > 0) {
                    window.messages.push(...newMessages);
                    UI.appendMessages(newMessages, window.deviceId, window.currentUser.name);
                    const latest = newMessages[newMessages.length - 1].timestamp;
                    if (latest > window.lastMessageTime) window.lastMessageTime = latest;
                }
            }
        } catch (err) {
            console.warn('loadMessages error', err);
        }
    };

    // Select user function (exposed globally)
    window.selectUser = function(user) {
        window.currentUser = user;
        window.messages = [];
        window.lastMessageTime = new Date(0).toISOString();
        UI.clearMessages();
        UI.setCurrentChat(user);
        window.startPolling();
        // Load messages immediately
        API.getMessages(window.deviceId, window.lastMessageTime).then(data => {
            if (data.success && data.data.length > 0) {
                window.messages = data.data;
                UI.appendMessages(data.data, window.deviceId, user.name);
                const latest = data.data[data.data.length - 1].timestamp;
                if (latest > window.lastMessageTime) window.lastMessageTime = latest;
            }
        });
        // Update selected highlight (will be handled by renderUsers)
        UI.renderUsers(window.allUsers, window.deviceId);
        UI.renderRecentChats(window.allUsers);
        
        // Mark messages as read (new)
        API.markAsRead(user.deviceId).catch(err => console.warn('markAsRead failed', err));
    };

    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('emojiPickerModal').classList.add('hidden');
            document.getElementById('mediaPreviewModal').classList.add('hidden');
            document.getElementById('userProfileModal').classList.add('hidden');
        });
    });
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
})();
