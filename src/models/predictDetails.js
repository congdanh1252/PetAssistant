import firestore from '@react-native-firebase/firestore';

export default class PredictDetail {
    constructor() {
      this.title = '';
      this.predict = '';
      this.advice = '';
      this.color = '';
    }
  
    update(data) {
      this.title = data.title || '';
      this.predict = data.predict || '';
      this.advice = data.advice || '';
      this.color = data.color || '';
    }
  
    static clone(data) {
      const predict = new PredictDetail();
      predict.update(data);
      return predict;
    }
  }