export default class Guide {
    constructor() {
      this._id = '';
      this.title = '';
      this.thumbnail = '';
      this.rating = '';
      this.rating_count = 0;
      this.section = new Array();
    }

    update(data) {
      this._id = data._id || '';
      this.title = data.title || '';
      this.thumbnail = data.thumbnail || '';
      this.rating = data.rating || '';
      this.rating_count = parseInt(data.rating_count) || 0;
      this.section = data.section || '';
    }

    static clone(data) {
      const guide = new Guide();
      guide.update(data);
      return guide;
    }
}