// ui.js
const UI = {
    messageContainer: document.getElementById('messageContainer'),
    usersContainer: { online: document.getElementById('onlineUsersList'), offline: document.getElementById('offlineUsersList') },
    recentChats: document.getElementById('recentChatsList'),
    currentUserDisplay: document.getElementById('currentUserDisplayName'),
    currentUserAvatar: document.getElementById('currentUserAvatar'),
    profileName: document.getElementById('profileName'),
    profileAvatar: document.getElementById('profileAvatar'),
    chatWith: document.getElementById('chatWith'),
    chatStatus: document.getElementById('chatStatus'),

    renderUsers(users, currentUserId) {
        // Implementation (splits online/offline, creates HTML)
    },

    renderMessage(msg, isMine, otherUserName) {
        // Creates message element with formatting, reactions, etc.
    },

    appendMessage(msg) {
        this.messageContainer.appendChild(this.renderMessage(msg));
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    },

    updateProfile(name) {
        this.currentUserDisplay.textContent = name;
        this.profileName.textContent = name;
        const initial = name[0] || '?';
        this.currentUserAvatar.textContent = initial;
        this.profileAvatar.textContent = initial;
    },

    showTyping() {
        this.chatStatus.innerHTML = '<span class="badge-online"></span> typing...';
    },

    hideTyping() {
        this.chatStatus.innerHTML = '<span class="badge-online"></span> online';
    }
};

window.UI = UI;
