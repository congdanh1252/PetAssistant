import firestore from "@react-native-firebase/firestore"
import Reminder from "../../models/reminder"
import Pet from "../../models/pet"
import ServiceItem from "../../models/serviceItem"
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

      console.log(reminder.service)

      firestore()
        .collection("users")
        .doc(reminder.user._id)
        .onSnapshot((documentSnapshot) => {
          reminder.user.update(documentSnapshot.data())

          var services = new Array()
          for (let i = 0; i < reminder.service.length; i++) {
            firestore()
              .collection("thirdParty/NbPlzxROMlRyZ02vdVZf/service")
              .doc(reminder.service[i])
              .onSnapshot((documentSnapshot) => {
                var service = new ServiceItem()
                service.update(documentSnapshot.data())
                service._id = documentSnapshot.id
                services.push(service)

                reminder.service = services
                if (i == reminder.service.length - 1) {
                  handleReminder(reminder)
                }
              }, onError)
          }
        }, onError)
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
      customer: reminder.user._id,
      service: reminder.service,
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
        reminder._id = documentSnapshot.id

        firestore()
          .collection("users")
          .doc(reminder.user._id)
          .onSnapshot((documentSnapshot) => {
            reminder.user.update(documentSnapshot.data())

            if (reminder.datetime > new Date()) {
              remindersList.push(reminder)
            } else {
              oldRemindersList.push(reminder)
            }

            // console.log(reminder)
            handleCallback(remindersList, oldRemindersList)
          }, onError)
      })
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
