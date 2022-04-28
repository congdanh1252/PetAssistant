import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import Expenditure from "../../models/expenditure"

function onError(error) {
  console.error(error)
}

function sort(array) {
  function compareNumbers(a, b) {
    return b - a
  }

  array.join()
  array.sort()
  array.sort(compareNumbers)

  return array
}

export const getIncome = (date, handleIncome) => {
  var incomeList = new Array()
  var startOfToday = firestore.Timestamp.fromDate(
    new Date(date.setHours(0, 0, 0, 0))
  )
  var endOfToday = firestore.Timestamp.fromDate(
    new Date(date.setHours(23, 59, 59, 999))
  )
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/income")
    .where("date", ">=", startOfToday)
    .where("date", "<=", endOfToday)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        var income = new Expenditure()
        income.update(documentSnapshot.data())
        income.date = documentSnapshot.data().date.toDate()
        income._id = documentSnapshot.id
        incomeList.push(income)
      })
      handleIncome(incomeList)
    }, onError)
}

export const getAllDateTP = (date, handleDatesCallback) => {
  var datesList = new Array()
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/income")
    .where("month", "==", date.getMonth() + 1)
    .where("year", "==", date.getFullYear())
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        var tempDate = documentSnapshot.data().date.toDate().getDate()
        if (!datesList.includes(tempDate)) datesList.push(tempDate)
      })
      handleDatesCallback(sort(datesList))
    }, onError)
}

export const getMonthTotal = (date, handleTotalCallback) => {
  var total = 0
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/income")
    .where("month", "==", date.getMonth() + 1)
    .where("year", "==", date.getFullYear())
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        total += parseInt(documentSnapshot.data().amount)
      })
      handleTotalCallback(total)
    }, onError)
}

export const findDateByKeyword = (keyword, date, handleDatesCallback) => {
  var datesList = new Array()
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/income")
    .where("month", "==", date.getMonth() + 1)
    .where("year", "==", date.getFullYear())
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        if (documentSnapshot.data().title.includes(keyword)) {
          var tempDate = documentSnapshot.data().date.toDate().getDate()
          if (!datesList.includes(tempDate)) datesList.push(tempDate)
        }
      })
      handleDatesCallback(sort(datesList))
    }, onError)
}

export const addIncome = (income, handleAddIncomeCallback) => {
  var dt = new Date(income.date)
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/income")
    .add({
      title: income.title,
      amount: parseInt(income.amount),
      month: dt.getMonth() + 1,
      date: firestore.Timestamp.fromDate(dt),
      year: dt.getFullYear(),
      type: income.type,
      service: income.service,
    })
    .then(() => {
      handleAddIncomeCallback()
    }, onError)
}

export const updateIncome = (income, handleUpdateIncomeCallback) => {
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/income")
    .doc(income._id)
    .set({
      title: income.title,
      amount: parseInt(income.amount),
      month: income.date.getMonth() + 1,
      date: firestore.Timestamp.fromDate(new Date(income.date)),
      year: income.date.getFullYear(),
      type: income.type,
      //service: income.service,
    })
    .then(() => {
      handleUpdateIncomeCallback()
    }, onError)
}

export const deleteIncome = (income, handleDeleteIncomeCallback) => {
  firestore()
    .collection("users/" + auth().currentUser.uid + "/income")
    .doc(income._id)
    .delete()
    .then(() => {
      handleDeleteIncomeCallback()
    }, onError)
}

export const getMonthStatisticTP = (date, handleStatisticCallback) => {
  var values = [0, 0, 0, 0, 0]
  var percentage = [0, 0, 0, 0, 0]
  var total = 0
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/income")
    .where("month", "==", date.getMonth() + 1)
    .where("year", "==", date.getFullYear())
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        var type = documentSnapshot.data().type
        var amount = documentSnapshot.data().amount
        total += amount
        switch (type) {
          case "Doctor":
            values[0] += amount
            break
          case "Food":
            values[1] += amount
            break
          case "Service":
            values[2] += amount
            break
          case "Stuff":
            values[3] += amount
            break
          default:
            values[4] += amount
            break
        }
      })
      for (var i = 0; i < values.length; i++) {
        percentage[i] = Math.round((values[i] / total) * 100)
      }
      handleStatisticCallback(values, percentage)
    }, onError)
}
