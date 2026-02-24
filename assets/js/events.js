// events.js – All event listeners and user interactions

const EventHandlers = {
    typingTimeout: null,
    isTyping: false,

    init() {
        // Send message
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Typing indicator
        document.getElementById('messageInput').addEventListener('input', () => this.handleTyping());

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

        // Settings toggles
        document.getElementById('notificationsToggle')?.addEventListener('change', (e) => {
            NotificationManager.toggleNotifications(e.target.checked);
        });
        document.getElementById('soundToggle')?.addEventListener('change', (e) => {
            NotificationManager.toggleSound(e.target.checked);
        });
        document.getElementById('historyToggle')?.addEventListener('change', (e) => {
            localStorage.setItem('history', e.target.checked);
        });
        if (document.getElementById('readReceiptsToggle')) {
            document.getElementById('readReceiptsToggle').addEventListener('change', (e) => {
                window.readReceiptsEnabled = e.target.checked;
                localStorage.setItem('readReceipts', e.target.checked);
            });
        }
        if (document.getElementById('typingIndicatorToggle')) {
            document.getElementById('typingIndicatorToggle').addEventListener('change', (e) => {
                window.typingIndicatorEnabled = e.target.checked;
                localStorage.setItem('typingIndicator', e.target.checked);
            });
        }
        if (document.getElementById('statusSelect')) {
            document.getElementById('statusSelect').addEventListener('change', (e) => {
                const status = e.target.value;
                localStorage.setItem('userStatus', status);
                document.getElementById('currentUserStatus').textContent = status;
            });
        }

        // Edit profile (toggle bio edit)
        document.getElementById('editProfileBtn').addEventListener('click', () => {
            const bio = document.getElementById('profileBio');
            if (bio.isContentEditable) {
                bio.contentEditable = false;
                document.getElementById('editProfileBtn').innerHTML = '<i class="fas fa-edit"></i> Edit';
                // Save bio (would send to backend)
                alert('✨ Profile updated (placeholder)');
            } else {
                bio.contentEditable = true;
                bio.focus();
                document.getElementById('editProfileBtn').innerHTML = '<i class="fas fa-save"></i> Save';
            }
        });

        // Profile picture upload (new)
        const profileAvatar = document.getElementById('profileAvatar');
        profileAvatar.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageData = event.target.result;
                        // Store in localStorage for now (later send to server)
                        localStorage.setItem('chatMyAvatar', imageData);
                        window.myAvatar = imageData;
                        UI.updateProfile(window.myName, imageData);
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });

        // User menu (placeholder)
        document.getElementById('userMenuToggle').addEventListener('click', () => {
            alert('✨ User menu coming soon!');
        });

        // Search input (debounced)
        document.getElementById('contactSearch').addEventListener('input', Utils.debounce((e) => {
            const query = e.target.value.toLowerCase();
            if (window.allUsers) {
                const filtered = window.allUsers.filter(u => u.name.toLowerCase().includes(query) || u.deviceId.includes(query));
                UI.renderUsers(filtered, window.deviceId);
            }
        }, 300));

        // Collapsible sections
        document.querySelectorAll('[data-toggle="collapse"]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.dataset.target;
                const target = document.querySelector(targetId);
                if (target) {
                    target.classList.toggle('expanded');
                    const expanded = target.classList.contains('expanded');
                    trigger.setAttribute('aria-expanded', expanded);
                }
            });
        });

        // Close sidebars when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const rightPanel = document.getElementById('rightPanel');
                if (!sidebar.contains(e.target) && !document.getElementById('sidebarToggle').contains(e.target)) {
                    sidebar.classList.remove('open');
                }
                if (!rightPanel.contains(e.target) && !document.getElementById('rightPanelToggle').contains(e.target)) {
                    rightPanel.classList.remove('open');
                }
            }
        });
    },

    async sendMessage() {
        const input = document.getElementById('messageInput');
        let msg = input.value;
        if (!msg || !window.currentUser) return;

        if (window.replyToMessage) {
            msg = `> ${window.replyToMessage.text}\n\n` + msg;
            window.replyToMessage = null;
            document.getElementById('replyPreview').classList.add('hidden');
        }

        // Optimistic UI update
        const tempMsg = {
            id: 'temp-' + Date.now(),
            from: window.deviceId,
            text: msg,
            timestamp: new Date().toISOString()
        };
        UI.appendMessage(tempMsg, true, window.currentUser.name);
        input.value = '';

        // Handle offline
        if (OfflineManager.isOffline) {
            OfflineManager.queueMessage(window.currentUser.deviceId, msg);
            return;
        }

        try {
            const data = await API.sendMessage(window.deviceId, window.currentUser.deviceId, msg);
            if (!data.success) {
                OfflineManager.queueMessage(window.currentUser.deviceId, msg);
            }
        } catch (err) {
            console.warn('Send failed, will retry later');
            OfflineManager.queueMessage(window.currentUser.deviceId, msg);
        }
    },

    async setName() {
        const nameInput = document.getElementById('nameInput');
        const name = nameInput.value.trim();
        if (!name) return;

        try {
            const data = await API.setName(window.deviceId, name);
            if (data.success) {
                window.myName = name;
                localStorage.setItem('chatMyName', name);
                UI.updateProfile(name, window.myAvatar);
                document.getElementById('nameInputContainer').classList.add('hidden');
                API.getUsers(window.deviceId).then(data => {
                    if (data.success) {
                        window.allUsers = data.data;
                        UI.renderUsers(data.data, window.deviceId);
                        UI.renderRecentChats(data.data);
                    }
                });
            }
        } catch (err) {
            alert('Failed to set name. Try again.');
        }
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

    handleTyping() {
        if (!window.currentUser || !window.typingIndicatorEnabled) return;
        if (!this.isTyping) {
            this.isTyping = true;
            UI.showTyping();
        }
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
            UI.hideTyping();
        }, 2000);
    },

    openEmojiPicker() {
        const modal = document.getElementById('emojiPickerModal');
        modal.classList.remove('hidden');
        const grid = document.getElementById('emojiGrid');
        if (grid.children.length === 0) {
            const emojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾'];
            emojis.forEach(emoji => {
                const btn = document.createElement('button');
                btn.textContent = emoji;
                btn.onclick = () => {
                    document.getElementById('messageInput').value += emoji;
                    modal.classList.add('hidden');
                };
                grid.appendChild(btn);
            });
        }
    }
};

window.EventHandlers = EventHandlers;
