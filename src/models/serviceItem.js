export default class ServiceItem {
    constructor() {
      this._id = '';
      this.active = true;
      this.detail = '';
      this.price = '';
      this.description = '';
    }

    update(data) {
        this._id = data._id || '';
        this.active = data.active || false;
        this.detail = data.detail || '';
        this.price = data.price || '';
        this.description = data.description || '';
    }

    static clone(data) {
      const item = new ServiceItem();
      item.update(data);
      return item;
    }
}