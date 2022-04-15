import firestore from "@react-native-firebase/firestore"

export default class MarketItem {
  constructor() {
    this._id = ""
    this.seller_id = ""
    this.name = ""
    this.description = ""
    this.price = ""
    this.species = ""
    this.weight = ""
    this.height = ""
    this.kind = ""
    this.gender = ""
    this.province = ""
    this.discount_price = ""
    this.photo = "null"
    this.photos = new Array()
  }

  update(data) {
    this._id = "" || data._id
    this.seller_id = "" || data.seller_id
    this.name = "" || data.name
    this.description = "" || data.description
    this.price = "" || data.price
    this.species = "" || data.species
    this.weight = "" || data.weight
    this.height = "" || data.height
    this.kind = "" || data.kind
    this.gender = "" || data.gender
    this.province = "" || data.province
    this.discount_price = "" || data.discount_price
    this.photo = "" || data.photo
    this.photos = new Array() || data.additional_photos
  }

  static clone(data) {
    const marketItem = new MarketItem()
    marketItem.update(data)
    return marketItem
  }
}
