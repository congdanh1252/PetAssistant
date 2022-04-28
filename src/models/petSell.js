export default class PetSell {
    constructor() {
      this._id = '';
      this.name = '';
      this.weight = 0;
      this.height = 0;
      this.kind = '';
      this.species = '';
      this.gender = '';
      this.photo = '';
      this.age = '';
      this.description = '';
      this.seller_id = '';
      this.price = 0;
      this.discount_price = 0;
      this.additional_photos = new Array(); 
    }
  
    update(data) {
      this._id = data._id || '';
      this.name = data.name || '';
      this.weight = data.weight || 0;
      this.height = data.height || 0;
      this.kind = data.kind || '';
      this.species = data.species || '';
      this.gender = data.gender || '';
      this.photo = data.photo || '';
      this.photo = data.age || '';
      this.description = data.description || '';
      this.seller_id = data.seller_id || '';
      this.price = data.price || 0;
      this.discount_price = data.discount_price || 0;
      this.additional_photos = data.additional_photos || new Array(); 
    }
  
    static clone(data) {
      const pet = new PetSell();
      pet.update(data);
      return pet;
    }
  }