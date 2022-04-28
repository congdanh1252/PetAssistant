export default class Income {
  constructor() {
    this._id = ""
    this.date = new Date()
    this.service = new Array()
    this.amount = 0
    this.title = ""
    this.type = ""
  }

  update(data) {
    this._id = data._id || ""
    this.date = data.date || new Date()
    this.service = data.service || new Array()
    this.amount = data.amount || 0
    this.title = data.title || ""
    this.type = data.type || ""
  }

  static clone(data) {
    const income = new Income()
    income.update(data)
    return income
  }
}
