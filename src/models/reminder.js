import firestore from '@react-native-firebase/firestore';

export default class Reminder {
    constructor() {
      this._id = '';
      this.title = '';
      this.description = '';
      this.datetime = new Date();
      this.details = new Array();
      this.pets = new Array();
      this.type = '';
      this.reminderType = '';
      this.enable = false;
      this.frequency = '';
      this.notificationId = Math.floor(Math.random() * 1000000) + 1;
    }
  
    update(data) {
      this._id = data._id || '';
      this.title = data.title || '';
      this.description = data.description || '';
      this.datetime = data.datetime.toDate() || new Date();
      this.details = data.details || new Array();
      this.pets = data.pets || new Array();
      this.type = data.type || '';
      this.reminderType = data.reminderType || '';
      this.enable = data.enable || false;
      this.frequency = data.frequency || '';
      this.notificationId = data.notificationId || Math.floor(Math.random() * 1000000) + 1;
    }
  
    static clone(data) {
      const reminder = new Reminder();
      reminder.update(data);
      return reminder;
    }
  }