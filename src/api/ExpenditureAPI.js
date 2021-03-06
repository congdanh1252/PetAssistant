import firestore from '@react-native-firebase/firestore';
import Expenditure from '../models/expenditure';
import auth from '@react-native-firebase/auth';

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
  .collection('users/' + auth().currentUser.uid + '/expenditures')
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
  .collection('users/' + auth().currentUser.uid + '/expenditures')
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
  .collection('users/' + auth().currentUser.uid + '/expenditures')
  .where('month', '==', date.getMonth() + 1)
  .where('year', '==', date.getFullYear())
  .get()
  .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        total += parseInt(documentSnapshot.data().amount)
      });
      handleTotalCallback(total);
  }, onError);
}

export const getMonthLimit = (handleMonthLimitCallback) => {
  var limit = 0
  firestore()
  .collection('users')
  .doc(auth().currentUser.uid)
  .get()
  .then(documentSnapshot => {
      limit = documentSnapshot.data().expenditure_limit
      handleMonthLimitCallback(limit);
  }, onError);
}

export const updateMonthLimit = (monthLimit, handleCallback) => {
  firestore()
  .collection('users')
  .doc(auth().currentUser.uid)
  .update({
    expenditure_limit: monthLimit
  })
  .then(() => {
    handleCallback()
    console.log("Updated!");
  }, onError);
}

export const getMonthAverage = (date, handleMonthAvgCallback) => {
  var avg = 0
  var count = 0
  firestore()
  .collection('users/' + auth().currentUser.uid + '/expenditures')
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
      avg += documentSnapshot.data().amount
      count++
    });
    handleMonthAvgCallback(avg);
  }, onError);
}

export const findDateByKeyword = (keyword, date, handleDatesCallback) => {
  var datesList = new Array();
  firestore()
  .collection('users/' + auth().currentUser.uid + '/expenditures')
  .where('month', '==', date.getMonth() + 1)
  .where('year', '==', date.getFullYear())
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
      if (documentSnapshot.data().title.includes(keyword)) {
        var tempDate = documentSnapshot.data().date.toDate().getDate()
        if (!datesList.includes(tempDate))
          datesList.push(tempDate)
      }
    });
    handleDatesCallback(sort(datesList))
  }, onError);
}

export const addExpenditure = (expenditure, handleAddExpenditureCallback) => {
  var dt = new Date(expenditure.date)
  firestore()
  .collection('users/' + auth().currentUser.uid + '/expenditures')
  .add({
    title: expenditure.title,
    amount: parseInt(expenditure.amount),
    month: dt.getMonth() + 1,
    date: firestore.Timestamp.fromDate(dt),
    year: dt.getFullYear(),
    type: expenditure.type,
  })
  .then(() => {
    handleAddExpenditureCallback()
  }, onError);
}

export const addExpenditureWithId = (expenditure, userId, handleAddExpenditureCallback) => {
  var dt = new Date(expenditure.date)
  firestore()
  .collection('users/' + userId + '/expenditures')
  .add({
    title: expenditure.title,
    amount: parseInt(expenditure.amount),
    month: dt.getMonth() + 1,
    date: firestore.Timestamp.fromDate(dt),
    year: dt.getFullYear(),
    type: expenditure.type,
  })
  .then(() => {
    handleAddExpenditureCallback()
  }, onError);
}

export const updateExpenditure = (expenditure, handleUpdateExpenditureCallback) => {
  firestore()
  .collection('users/' + auth().currentUser.uid + '/expenditures')
  .doc(expenditure._id)
  .set({
    title: expenditure.title,
    amount: parseInt(expenditure.amount),
    month: expenditure.date.getMonth() + 1,
    date: firestore.Timestamp.fromDate(new Date(expenditure.date)),
    year: expenditure.date.getFullYear(),
    type: expenditure.type,
  })
  .then(() => {
    handleUpdateExpenditureCallback()
  }, onError);
}

export const deleteExpenditure = (expenditure, handleDeleteExpenditureCallback) => {
  firestore()
  .collection('users/' + auth().currentUser.uid + '/expenditures')
  .doc(expenditure._id)
  .delete()
  .then(() => {
    handleDeleteExpenditureCallback()
  }, onError);
}

export const getMonthStatistic = (date, handleStatisticCallback) => {
  var values = [0, 0, 0, 0, 0]
  var percentage = [0, 0, 0, 0, 0]
  var total = 0
  firestore()
  .collection('users/' + auth().currentUser.uid + '/expenditures')
  .where('month', '==', date.getMonth() + 1)
  .where('year', '==', date.getFullYear())
  .get()
  .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        var type = documentSnapshot.data().type
        var amount = documentSnapshot.data().amount
        total += amount
        switch (type) {
          case 'Doctor':
            values[0] += amount
            break
          case 'Food':
            values[1] += amount
            break
          case 'Service': 
            values[2] += amount
            break
          case 'Stuff':
            values[3] += amount
            break
          default:
            values[4] += amount
            break
        }
      });
      for (var i = 0; i < values.length; i++) {
        percentage[i] = Math.round(values[i] / total * 100)
      }
      handleStatisticCallback(values, percentage)
  }, onError);
}