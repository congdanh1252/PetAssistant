export default class Treatment {
    constructor() {
      this._id = '';
      this.pet_id = '';
      this.detail = '';
      this.taken_date = '';
      this.medicine = '';
      this.note = '';
    }
  
    update(data) {
        this._id = data.id || '';
        this.pet_id = data.pet_id || '';
        this.detail = data.detail || '';
        this.taken_date = data.taken_date || '';
        this.medicine = data.medicine || '';
        this.note = data.note || '';
    }
  
    static clone(data) {
      const treatment = new Treatment();
      treatment.update(data);
      return treatment;
    }
  }