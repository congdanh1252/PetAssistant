import firestore from '@react-native-firebase/firestore';
import Expenditure from '../models/expenditure';

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

export const getExpenditures = (date, handleExpenditures) => {
  var expenditureList = new Array();

  var startOfToday =  firestore.Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0))); 
  var endOfToday = firestore.Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999))); 
  firestore()
  .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/expenditures')
  .where('date','>=',startOfToday)
  .where('date', '<=', endOfToday)
  .get()
  .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        var expenditure = new Expenditure();
        expenditure.update(documentSnapshot.data())
        expenditure.date = documentSnapshot.data().date.toDate()
        expenditure._id = documentSnapshot.id;
        expenditureList.push(expenditure);
      });
      handleExpenditures(expenditureList);
  }, onError);
}

export const getAllDate = (date, handleDatesCallback) => {
  var datesList = new Array();
  firestore()
  .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/expenditures')
  .where('month', '==', date.getMonth() + 1)
  .where('year', '==', date.getFullYear())
  .get()
  .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        var tempDate = documentSnapshot.data().date.toDate().getDate()
        if (!datesList.includes(tempDate))
          datesList.push(tempDate)
      });
      handleDatesCallback(sort(datesList));
  }, onError);
}

export const getMonthTotal = (date, handleTotalCallback) => {
  var total = 0;
  firestore()
  .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/expenditures')
  .where('month', '==', date.getMonth() + 1)
  .where('year', '==', date.getFullYear())
  .get()
  .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        total += documentSnapshot.data().amount
      });
      handleTotalCallback(total);
  }, onError);
}

export const getMonthLimitAndAvg = (handleMonthLimitCallback) => {
  var limit = 0
  var avg = 0
  firestore()
  .collection('users')
  .doc('VbNsDN6X1EgC4f0FfXAQvtZJ21q2')
  .get()
  .then(documentSnapshot => {
      limit = documentSnapshot.data().expenditure_limit
      avg = documentSnapshot.data().expenditure_avg
      handleMonthLimitCallback(limit, avg);
  }, onError);
}

export const findDateByKeyword = (keyword, handleDatesCallback) => {
  var datesList = new Array();
  firestore()
  .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/expenditures')
  .orderBy('date', 'desc')
  .get()
  .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        if (documentSnapshot.data().title.includes(keyword)) {
          var tempDate = documentSnapshot.data().date.toDate().getDate()
          if (!datesList.includes(tempDate))
            datesList.push(tempDate)
        }
      });
      handleDatesCallback(datesList);
  }, onError);
}