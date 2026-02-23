// events.js
const EventHandlers = {
    init() {
        // Send message
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Set name
        document.getElementById('setNameBtn').addEventListener('click', () => this.setName());

        // Cancel reply
        document.getElementById('cancelReply').addEventListener('click', () => this.cancelReply());

        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });

        // Sidebar toggles
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
        document.getElementById('rightPanelToggle').addEventListener('click', () => {
            document.getElementById('rightPanel').classList.toggle('open');
        });

        // Emoji picker
        document.getElementById('emojiBtn').addEventListener('click', () => this.openEmojiPicker());

        // Attach file (placeholder)
        document.getElementById('attachBtn').addEventListener('click', () => alert('✨ File upload coming soon!'));

        // Voice message (placeholder)
        document.getElementById('voiceBtn').addEventListener('click', () => alert('✨ Voice messages coming soon!'));
    },

    async sendMessage() {
        // Implementation – calls API, updates UI
    },

    async setName() {
        // Implementation
    },

    cancelReply() {
        window.replyToMessage = null;
        document.getElementById('replyPreview').classList.add('hidden');
    },

    switchTab(tab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.getElementById('chatsPanel').classList.toggle('hidden', target !== 'chats');
        document.getElementById('contactsPanel').classList.toggle('hidden', target !== 'contacts');
        document.getElementById('featuresPanel').classList.toggle('hidden', target !== 'features');
    },

    openEmojiPicker() {
        // Implementation
    }
};

window.EventHandlers = EventHandlers;
