import firestore from '@react-native-firebase/firestore';
import Reminder from '../models/reminder';

function onError(error) {
  console.error(error);
}

export const getReminder = (reminderID, handleReminder) => {
  var reminder = new Reminder(reminderID);
  firestore()
  .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/reminders')
  .doc(reminderID)
  .onSnapshot(documentSnapshot => {
      reminder.update(documentSnapshot.data())
      reminder.datetime = documentSnapshot.data().datetime.toDate()
      reminder._id = reminderID
      handleReminder(reminder)
  }, onError);
}

export const updateReminder = (reminder) => {
  firestore()
  .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/reminders')
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