import firestore from "@react-native-firebase/firestore"
import User from "./user"

export default class Reminder {
  constructor() {
    this._id = ""
    this.title = ""
    this.description = ""
    this.datetime = new Date()
    this.details = new Array()
    this.pets = new Array()
    this.type = ""
    this.reminderType = ""
    this.enable = false
    this.frequency = ""
    this.user = new User()
    this.service = new Array()
    this.notificationId = Math.floor(Math.random() * 1000000) + 1
    this.customer = ""
  }

  update(data) {
    this._id = data._id || ""
    this.title = data.title || ""
    this.description = data.description || ""
    this.datetime = data.datetime.toDate() || new Date()
    this.details = data.details || new Array()
    this.pets = data.pets || new Array()
    this.type = data.type || ""
    this.reminderType = data.reminderType || ""
    this.enable = data.enable || false
    this.frequency = data.frequency || ""
    this.user._id = data.customer || ""
    this.service = data.service || new Array()
    this.notificationId =
      data.notificationId || Math.floor(Math.random() * 1000000) + 1
    this.customer = data.customer || ""
  }

  static clone(data) {
    const reminder = new Reminder()
    reminder.update(data)
    return reminder
  }
}
