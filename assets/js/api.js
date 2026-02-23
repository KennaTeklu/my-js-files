// api.js
const API = {
    baseUrl: 'https://my-proxy-server-phi.vercel.app/api/proxy',

    async register(deviceId) {
        return this._fetch(`action=register&deviceId=${deviceId}`);
    },

    async setName(deviceId, name) {
        return this._fetch(`action=setName&deviceId=${deviceId}&name=${encodeURIComponent(name)}`, { method: 'POST' });
    },

    async getUsers(deviceId) {
        return this._fetch(`action=getUsers&deviceId=${deviceId}`);
    },

    async sendMessage(fromId, toId, message) {
        return this._fetch(`action=sendMessage&fromDeviceId=${fromId}&toDeviceId=${toId}&message=${encodeURIComponent(message)}`, { method: 'POST' });
    },

    async getMessages(deviceId, since) {
        return this._fetch(`action=getMessages&deviceId=${deviceId}&since=${since}`);
    },
    async addReaction(messageId, emoji) {
      return this._fetch(`action=addReaction&messageId=${messageId}&deviceId=${window.deviceId}&emoji=${encodeURIComponent(emoji)}`, { method: 'POST' });
    },
    
    async removeReaction(messageId, emoji) {
      return this._fetch(`action=removeReaction&messageId=${messageId}&deviceId=${window.deviceId}&emoji=${encodeURIComponent(emoji)}`, { method: 'POST' });
    }

    async _fetch(query, options = {}) {
        const url = `${this.baseUrl}?${query}`;
        try {
            const res = await fetch(url, options);
            return await res.json();
        } catch (err) {
            console.error('API fetch error:', err);
            throw err;
        }
    }
};

window.API = API;
