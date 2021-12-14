import firestore from '@react-native-firebase/firestore';

export default class Reminder {
    constructor(_id) {
      this._id = _id;
      this.title = '';
      this.description = '';
      this.datetime = new Date();
      this.details = new Array();
      this.pets = new Array();
      this.type = '';
    }
  
    update(data) {
      this._id = data._id || '';
      this.title = data.title || '';
      this.description = data.description || '';
      this.datetime = data.datetime || new Date();
      this.details = data.details || new Array();
      this.pets = data.pets || new Array();
      this.type = data.type || '';
    }
  
    static clone(data) {
      const reminder = new Reminder();
      reminder.update(data);
      return reminder;
    }
  }