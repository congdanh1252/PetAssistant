export default class Expenditure {
    constructor() {
      this._id = '';
      this.date = new Date();
      this.amount = 0;
      this.title = '';
      this.type = '';
    }
  
    update(data) {
      this._id = data._id || '';
      this.date = data.date || new Date();
      this.amount = data.amount || 0;
      this.title = data.title || '';
      this.type = data.type || '';
    }
  
    static clone(data) {
      const reminder = new Reminder();
      reminder.update(data);
      return reminder;
    }
  }