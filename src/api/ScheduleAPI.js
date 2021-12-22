import firestore from '@react-native-firebase/firestore';
import Reminder from '../models/reminder';
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

export const getAllMonthReminder = (date, handleCallback) => {
    var remindersList = new Array();
    firestore()
    .collection('users/' + auth().currentUser.uid + '/reminders')
    .where('month', '==', date.getMonth() + 1)
    .where('year', '==', date.getFullYear())
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
            var reminder = new Reminder();
            reminder.update(documentSnapshot.data())
            remindersList.push(reminder)
        });
        handleCallback(sort(remindersList));
    }, onError);
}

export const getDateReminder = (date, handleCallback) => {
    console.log(date.getDate() + "/" +(date.getMonth() + 1) + "/" +  date.getFullYear());
    var remindersList = new Array();
    var oldRemindersList = new Array();
    firestore()
    .collection('users/' + auth().currentUser.uid + '/reminders')
    .where('month', '==', date.getMonth() + 1)
    .where('year', '==', date.getFullYear())
    .where('date', '==', date.getDate())
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
            var reminder = new Reminder();
            reminder.update(documentSnapshot.data())
            if (reminder.datetime > new Date()) {
                remindersList.push(reminder)
            } else {
                oldRemindersList.push(reminder)
            }
        });
        handleCallback(sort(remindersList), sort(oldRemindersList));
    }, onError);
}

export const getReminder = (reminderID, handleCallback) => {
    var reminder = new Reminder(reminderID);
    firestore()
    .collection('users/' + auth().currentUser.uid + '/reminders')
    .doc(reminderID)
    .onSnapshot(documentSnapshot => {
        reminder.update(documentSnapshot.data())
        reminder._id = reminderID
        handleCallback(reminder)
    }, onError);
}

export const updateReminder = (reminder) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/reminders')
    .doc(reminder._id)
    .update({
      _id: reminder._id,
      datetime: firestore.Timestamp.fromDate(new Date(reminder.datetime)),
      description: reminder.description,
      details: reminder.details,
      pets: reminder.pets,
      title: reminder.title,
      type: reminder.type
    })
    .then(() => {
      console.log("Success")
    })
}