export default class thirdParty {
    constructor() {
      this._id = '';
      this.name = '';
      this.address = '';
      this.phone_number = '';
      this.category = '';
      this.thumbnail = '';
      this.rating = '';
      this.rating_count = 0;
      this.img = new Array();
      this.service = new Array();
      this.feedback = new Array();
    }

    update(data) {
        this._id = data._id || '';
        this.name = data.name || '';
        this.address = data.address || '';
        this.phone_number = data.phone_number || '';
        this.category = data.category || '';
        this.thumbnail = data.thumbnail || '';
        this.rating = data.rating || '';
        this.rating_count = parseInt(data.rating_count) || 0;
        this.img = data.img || '';
        this.service = data.service || '';
        this.feedback = data.feedback || '';
    }

    static clone(data) {
      const obj = new thirdParty();
      obj.update(data);
      return obj;
    }
}