export default class Pet {
    constructor() {
      this._id = '';
      this.name = '';
      this.weight = 0;
      this.height = 0;
      this.kind = '';
      this.species = '';
    }
  
    update(data) {
      this._id = data._id || '';
      this.name = data.name || '';
      this.weight = data.weight || 0;
      this.height = data.height || 0;
      this.kind = data.kind || '';
      this.species = data.species || '';
    }
  
    static clone(data) {
      const pet = new Pet();
      pet.update(data);
      return pet;
    }
  }