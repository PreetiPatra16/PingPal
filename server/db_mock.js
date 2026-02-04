// In-Memory Data Store (Arrays)
const users = [];
const messages = [];

class MockUser {
    constructor(data) {
        this._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        this.username = data.username;
        this.password = data.password;
        this.isOnline = data.isOnline || false;
        this.lastSeen = data.lastSeen || new Date();
    }

    async save() {
        const existing = users.find(u => u.username === this.username);
        if (!existing) {
            users.push(this);
        }
        return this;
    }

    static async findOne(query) {
        return users.find(u => u.username === query.username) || null;
    }

    static async find(query) {
        if (query.username && query.username.$regex) {
            const regex = new RegExp(query.username.$regex, query.username.$options);
            return users.filter(u => regex.test(u.username));
        }
        return users;
    }

    // Helper to simulate Mongoose select
    static findWithSelect(query) {
        // Not implementing full chaining logic here, simple pass-through
        return this.find(query);
    }
}

class MockMessage {
    constructor(data) {
        this._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        this.room = data.room;
        this.sender = data.sender; // Should be ID or Object
        this.text = data.text;
        this.file = data.file;
        this.createdAt = new Date();
    }

    async save() {
        messages.push(this);
        return this;
    }

    // Populate simulation (hardcoded for sender username)
    async populate(field, select) {
        if (field === 'sender') {
            // If sender is an ID, find the user object
            if (typeof this.sender === 'string') {
                const user = users.find(u => u._id === this.sender) || users.find(u => u.username === this.sender); // Fallback to username if loose
                if (user) {
                    this.sender = { _id: user._id, username: user.username };
                } else {
                    // Fallback mock if not found
                    this.sender = { username: 'Unknown' };
                }
            }
        }
        return this;
    }

    static async find(query) {
        return messages.filter(m => m.room === query.room);
    }
}

module.exports = { MockUser, MockMessage };
