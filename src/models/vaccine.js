export default class Vaccine {
    constructor() {
      this._id = '';
      this.pet_id = '';
      this.type = '';
      this.detail = '';
      this.taken_date = '';
      this.retake_date = '';
      this.label_photo = '';
    }
  
    update(data) {
        this._id = data.id || '';
        this.pet_id = data.pet_id || '';
        this.type = data.type || '';
        this.detail = data.detail || '';
        this.taken_date = data.taken_date || '';
        this.retake_date = data.retake_date || '';
        this.label_photo = data.label_photo || '';
    }
  
    static clone(data) {
      const vaccine = new Vaccine();
      vaccine.update(data);
      return vaccine;
    }
  }