// ui.js – Complete DOM rendering and updates

const UI = {
    messageContainer: document.getElementById('messageContainer'),
    onlineUsersList: document.getElementById('onlineUsersList'),
    offlineUsersList: document.getElementById('offlineUsersList'),
    recentChatsList: document.getElementById('recentChatsList'),
    currentUserDisplay: document.getElementById('currentUserDisplayName'),
    currentUserAvatar: document.getElementById('currentUserAvatar'),
    profileName: document.getElementById('profileName'),
    profileAvatar: document.getElementById('profileAvatar'),
    profileBio: document.getElementById('profileBio'),
    chatWith: document.getElementById('chatWith'),
    chatStatus: document.getElementById('chatStatus'),

    // Render user lists (online/offline)
    renderUsers(users, currentDeviceId) {
        // In a real app, online status would come from lastSeen
        // For demo, we'll simulate online/offline
        const online = [];
        const offline = [];
        users.forEach(user => {
            // Randomly assign online status (fake)
            if (Math.random() > 0.5) online.push(user);
            else offline.push(user);
        });

        this.onlineUsersList.innerHTML = '';
        this.offlineUsersList.innerHTML = '';

        online.forEach(user => this._renderUserItem(user, this.onlineUsersList, true, currentDeviceId));
        offline.forEach(user => this._renderUserItem(user, this.offlineUsersList, false, currentDeviceId));

        if (online.length === 0) {
            this.onlineUsersList.innerHTML = '<div class="section-title" style="margin-top:0;">No users online</div>';
        }
        if (offline.length === 0) {
            this.offlineUsersList.innerHTML = '<div class="section-title" style="margin-top:0;">No offline users</div>';
        }
    },

    _renderUserItem(user, container, isOnline, currentDeviceId) {
        const div = document.createElement('div');
        div.className = 'user-item' + (window.currentUser && window.currentUser.deviceId === user.deviceId ? ' selected' : '');
        const avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        avatar.textContent = (user.name && user.name[0]) || '?';
        const info = document.createElement('div');
        info.className = 'user-info';
        info.innerHTML = `<div class="user-name">${user.name} ${isOnline ? '<span class="badge-online"></span>' : ''}</div>
                           <div class="user-status">${user.deviceId.substr(0,6)}…</div>`;
        div.appendChild(avatar);
        div.appendChild(info);
        div.onclick = () => {
            window.selectUser?.(user);
        };
        container.appendChild(div);
    },

    // Render recent chats (simplified)
    renderRecentChats(users) {
        this.recentChatsList.innerHTML = '';
        users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'chat-item' + (window.currentUser && window.currentUser.deviceId === user.deviceId ? ' selected' : '');
            const avatar = document.createElement('div');
            avatar.className = 'chat-avatar';
            avatar.textContent = (user.name && user.name[0]) || '?';
            const info = document.createElement('div');
            info.className = 'chat-info';
            info.innerHTML = `<div class="chat-name">${user.name}</div>
                               <div class="chat-last-message">Last message preview...</div>`;
            const time = document.createElement('div');
            time.className = 'chat-timestamp';
            time.textContent = 'now';
            div.appendChild(avatar);
            div.appendChild(info);
            div.appendChild(time);
            div.onclick = () => {
                window.selectUser?.(user);
            };
            this.recentChatsList.appendChild(div);
        });
    },

    // Create a message element (with formatting, reactions, context menu)
    createMessageElement(msg, isMine, otherUserName) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + (isMine ? 'mine' : '');
        msgDiv.dataset.messageId = msg.id;
        msgDiv.dataset.from = msg.from;
        msgDiv.dataset.text = msg.text;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = isMine ? (window.myName[0] || 'U') : (otherUserName[0] || 'U');

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';

        // Format text (bold, italic, code)
        let formattedText = msg.text
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.*?)\*/g, '<i>$1</i>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
        bubbleDiv.innerHTML = formattedText;

        // Reactions (placeholder)
        const reactionsDiv = document.createElement('div');
        reactionsDiv.className = 'message-reactions';
        if (msg.reactions) {
            msg.reactions.forEach(r => {
                const rSpan = document.createElement('span');
                rSpan.textContent = r.emoji;
                rSpan.title = r.users.join(', ');
                reactionsDiv.appendChild(rSpan);
            });
        }
        bubbleDiv.appendChild(reactionsDiv);

        const meta = document.createElement('div');
        meta.className = 'message-meta';
        meta.textContent = Utils.formatTime(msg.timestamp);
        if (isMine && window.readReceiptsEnabled) {
            const statusSpan = document.createElement('span');
            statusSpan.className = 'message-status';
            statusSpan.innerHTML = ' ✓✓'; // double check
            meta.appendChild(statusSpan);
        }
        bubbleDiv.appendChild(meta);

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubbleDiv);

        // Right-click context menu
        msgDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showMessageContextMenu(e, msg, isMine);
        });

        // Double-click to react
        msgDiv.addEventListener('dblclick', () => {
            this.showReactionPicker(msg);
        });

        return msgDiv;
    },

    // Append a single message to container
    appendMessage(msg, isMine, otherUserName) {
        const el = this.createMessageElement(msg, isMine, otherUserName);
        this.messageContainer.appendChild(el);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    },

    // Append multiple messages
    appendMessages(messages, currentDeviceId, otherUserName) {
        messages.forEach(msg => {
            const isMine = msg.from === currentDeviceId;
            const el = this.createMessageElement(msg, isMine, otherUserName);
            this.messageContainer.appendChild(el);
        });
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    },

    // Clear messages
    clearMessages() {
        this.messageContainer.innerHTML = '';
    },

    // Update profile display
    updateProfile(name) {
        this.currentUserDisplay.textContent = name;
        this.profileName.textContent = name;
        const initial = name[0] || '?';
        this.currentUserAvatar.textContent = initial;
        this.profileAvatar.textContent = initial;
    },

    // Show typing indicator
    showTyping() {
        this.chatStatus.innerHTML = '<span class="badge-online"></span> typing...';
    },

    // Hide typing indicator
    hideTyping() {
        this.chatStatus.innerHTML = '<span class="badge-online"></span> online';
    },

    // Update chat header with selected user
    setCurrentChat(user) {
        this.chatWith.textContent = user.name;
    },

    // Context menu for messages
    showMessageContextMenu(e, msg, isMine) {
        const menu = document.createElement('div');
        menu.className = 'context-menu';

        const items = [
            { label: 'Reply', action: () => this.replyTo(msg) },
            { label: 'Copy', action: () => this.copyMessage(msg.text) },
            { label: 'Forward', action: () => alert('✨ Forward coming soon!') },
            { label: 'Edit', action: () => this.editMessage(msg), disabled: !isMine },
            { label: 'Delete', action: () => this.deleteMessage(msg), disabled: !isMine }
        ];

        items.forEach(item => {
            if (item.disabled) return;
            const div = document.createElement('div');
            div.textContent = item.label;
            div.onclick = () => {
                item.action();
                menu.remove();
            };
            menu.appendChild(div);
        });

        document.body.appendChild(menu);
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';

        // Close on click outside
        const closeMenu = (ev) => {
            if (!menu.contains(ev.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 10);
    },

    replyTo(msg) {
        window.replyToMessage = { id: msg.id, text: msg.text, from: msg.from };
        document.getElementById('replyText').textContent = `Replying to ${msg.from === window.deviceId ? 'yourself' : window.currentUser?.name}: ${msg.text.substring(0,30)}...`;
        document.getElementById('replyPreview').classList.remove('hidden');
    },

    copyMessage(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Message copied!');
        });
    },

    editMessage(msg) {
        alert('✨ Edit coming soon!');
    },

    deleteMessage(msg) {
        alert('✨ Delete coming soon!');
    },

    // Reaction picker (floating)
    showReactionPicker(msg) {
        const picker = document.createElement('div');
        picker.className = 'reaction-picker';
        const reactions = ['👍', '❤️', '😂', '😮', '😢', '👎'];
        reactions.forEach(emoji => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            btn.onclick = () => {
                alert(`✨ Reacted with ${emoji} (backend integration coming soon!)`);
                picker.remove();
            };
            picker.appendChild(btn);
        });
        document.body.appendChild(picker);
        const rect = event.target.getBoundingClientRect();
        picker.style.left = rect.left + 'px';
        picker.style.top = rect.top - 50 + 'px';
        setTimeout(() => {
            picker.remove();
        }, 5000);
    }
};

window.UI = UI;
