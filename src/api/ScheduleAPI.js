import firestore from '@react-native-firebase/firestore';
import Reminder from '../models/reminder';

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
    .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/reminder')
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
    .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/reminders')
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