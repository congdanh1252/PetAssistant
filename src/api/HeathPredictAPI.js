import firestore from '@react-native-firebase/firestore';
import HeathPredict from '../models/heathPredict';

function onError(error) {
  console.error(error);
}

function sort(array) {
  function compareNumbers(a, b) {
    return b - a;
  }
  
  array.join(); 
  array.sort(); 
  array.sort(compareNumbers); 

  return array;
}


export const getPredictList = (handleCallback) => {
  var PredictList = new Array()
  firestore()
  .collection('heathPredict')
  .onSnapshot(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        var heathPredict = new HeathPredict();
        heathPredict.update(documentSnapshot.data())
        heathPredict._id = documentSnapshot.id;
        PredictList.push(heathPredict);
      });
      handleCallback(PredictList);
  }, onError);
}


export const getPredictDetail = (id, handleCallback) => {
  firestore()
  .collection('heathPredict')
  .doc(id)
  .onSnapshot(documentSnapshot => {
    console.log(documentSnapshot);
    var heathPredict = new HeathPredict();
    heathPredict.update(documentSnapshot.data())
    heathPredict._id = documentSnapshot.id;
    handleCallback(heathPredict);
  }, onError);
}