export default class Chat {
    constructor() {
      this._id = '';
      this.user1 = '';
      this.user2 = '';
      this.user2Name = '';
      this.photoUrl = '',
      this.createdAt = '';
      this.updatedAt = '';
      this.lastMessage = '';
    }

    update(data) {
        this._id = data._id || '';
        this.user1 = data.user1 || '';
        this.user2 = data.user2 || '';
        this.user2Name = data.user2Name || '';
        this.photoUrl = data.photoUrl || '',
        this.createdAt = data.createdAt || '';
        this.updatedAt = data.updatedAt || '';
        this.lastMessage = data.lastMessage || '';
    }

    static clone(data) {
      const chat = new Chat();
      chat.update(data);
      return chat;
    }
}