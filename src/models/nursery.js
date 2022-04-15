import firestore from "@react-native-firebase/firestore"

export default class Nursery {
  constructor() {
    this._id = ""
    this.name = ""
    this.age = 0
    this.experience = ""
    this.level = ""
    this.status = ""
    this.hired_time = 0
    this.rating = 0
    this.photo = "null"
  }

  update(data) {
    this._id = data._id || ""
    this.name = data.name || ""
    this.age = data.age || 0
    this.experience = data.experience || ""
    this.level = data.level || ""
    this.status = data.status || ""
    this.hired_time = data.hired_time || 0
    this.rating = data.rating || 0
    this.photo = data.photo || ""
  }

  static clone(data) {
    const marketItem = new MarketItem()
    marketItem.update(data)
    return marketItem
  }
}
