import firestore from '@react-native-firebase/firestore';
import PredictDetail from './predictDetails';

export default class HeathPredict {
    constructor() {
      this._id = '';
      this.title = '';
      this.description = '';
      this.predictDetail = new Array();
    }
  
    update(data) {
      this._id = data._id || '';
      this.title = data.title || '';
      this.description = data.description || '';
      this.predictDetail = data.section || new Array();
    }
  
    static clone(data) {
      const heathpredict = new HeathPredict();
      heathpredict.update(data);
      return heathpredict;
    }
  }