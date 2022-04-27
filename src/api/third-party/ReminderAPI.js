import firestore from "@react-native-firebase/firestore"
import Reminder from "../../models/reminder"
import Pet from "../../models/pet"
import auth from "@react-native-firebase/auth"

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

export const getReminder = (reminderID, handleReminder) => {
  var reminder = new Reminder(reminderID)
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/reminders")
    .doc(reminderID)
    .onSnapshot((documentSnapshot) => {
      reminder.update(documentSnapshot.data())
      reminder.datetime = documentSnapshot.data().datetime.toDate()

      firestore()
      .collection("users")
      .doc(reminder.user._id)
      .onSnapshot((documentSnapshot) => {
        reminder.user.update(documentSnapshot.data())
        reminder.user._id = documentSnapshot.id
  
        handleReminder(reminder)
      }, onError)

      handleReminder(reminder)
    }, onError)
}

export const addReminder = (reminder, handleCallback) => {
  console.log(reminder)
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/reminders")
    .add(reminder)
    .then((docRef) => {
      console.log("Added")
      reminder._id = docRef.id
      firestore()
        .collection("thirdParty/" + auth().currentUser.uid + "/reminders")
        .doc(docRef.id)
        .update({
          _id: reminder._id,
          date: reminder.datetime.getDate(),
          month: reminder.datetime.getMonth() + 1,
          year: reminder.datetime.getFullYear(),
        })
        .then(() => {
          handleCallback(reminder)
        })
    })
}

export const updateReminder = (reminder) => {
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/reminders")
    .doc(reminder._id)
    .update({
      _id: reminder._id,
      date: reminder.datetime.getDate(),
      datetime: firestore.Timestamp.fromDate(new Date(reminder.datetime)),
      description: reminder.description,
      month: reminder.datetime.getMonth() + 1,
      pets: reminder.pets,
      title: reminder.title,
      type: reminder.type,
      year: reminder.datetime.getFullYear(),
    })
    .then(() => {
      console.log("Success")
    })
}

export const getDateReminder = (date, handleCallback) => {
  var remindersList = new Array()
  var oldRemindersList = new Array()
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/reminders")
    .where("month", "==", date.getMonth() + 1)
    .where("year", "==", date.getFullYear())
    .where("date", "==", date.getDate())
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        var reminder = new Reminder()
        reminder.update(documentSnapshot.data())
        if (reminder.datetime > new Date()) {
          remindersList.push(reminder)
        } else {
          oldRemindersList.push(reminder)
        }
      })
      handleCallback(remindersList, oldRemindersList)
    }, onError)
}

export const getMonthReminderDate = (date, handleCallback) => {
  var dates = new Array()

  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/reminders")
    .where("month", "==", date.getMonth() + 1)
    .where("year", "==", date.getFullYear())
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        if (!dates.includes(documentSnapshot.data().date)) {
          dates.push(documentSnapshot.data().date)
        }
      })
      handleCallback(dates)
    }, onError)
}
