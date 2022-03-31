export default class Message {
    constructor() {
      this._id = '';
      this.sender = '';
      this.detail = '';
      this.attachment = '';
    }

    update(data) {
        this._id = data._id || '';
        this.sender = data.sender || '';
        this.detail = data.detail || '';
        this.attachment = data.attachment || '';
    }

    static clone(data) {
      const msg = new Message();
      msg.update(data);
      return msg;
    }
}