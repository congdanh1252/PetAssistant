import firestore from "@react-native-firebase/firestore"

export default class Rating {
  constructor() {
    this._id = ""
    this.user = ""
    this.detail = ""
    this.period = 0
    this.rating = 0
  }

  update(data) {
    this._id = data._id || ""
    this.user = data.user || ""
    this.detail = data.detail || ""
    this.period = data.period || 0
    this.rating = data.rating || 0
  }

  static clone(data) {
    const marketItem = new MarketItem()
    marketItem.update(data)
    return marketItem
  }
}
