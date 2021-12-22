import firestore from '@react-native-firebase/firestore';
import Reminder from '../models/reminder';
import Pet from '../models/pet';
import auth from '@react-native-firebase/auth';


import {
  getPetName
} from '../api/PetAPI'
import { add } from 'react-native-reanimated';

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

export const getReminder = (reminderID, handleReminder) => {
  var reminder = new Reminder(reminderID);
  firestore()
  .collection('users/' + auth().currentUser.uid + '/reminders')
  .doc(reminderID)
  .onSnapshot(documentSnapshot => {
      reminder.update(documentSnapshot.data())
      reminder.datetime = documentSnapshot.data().datetime.toDate()
      handleReminder(reminder)
  }, onError);
}

export const addReminder = (reminder, handleCallback) => {
  firestore()
  .collection('users/' + auth().currentUser.uid + '/reminders')
  .add(reminder)
  .then(docRef => {
    reminder._id = docRef.id
    firestore()
    .collection('users/' + auth().currentUser.uid + '/reminders')
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
  });
}

export const updateReminder = (reminder) => {
  firestore()
  .collection('users/' + auth().currentUser.uid + '/reminders')
  .doc(reminder._id)
  .update({
    _id: reminder._id,
    date: reminder.datetime.getDate(),
    datetime: firestore.Timestamp.fromDate(new Date(reminder.datetime)),
    description: reminder.description,
    details: reminder.details,
    frequency: reminder.frequency,
    month: reminder.datetime.getMonth() + 1,
    pets: reminder.pets,
    reminderType: reminder.reminderType,
    title: reminder.title,
    type: reminder.type,
    year: reminder.datetime.getFullYear()
  })
  .then(() => {
    console.log("Success")
  })
}

export const getPetsReminder = (petsId, handleCallback) => {
  var existPets = new Array() 
  var addingPets = new Array() 
  firestore()
  .collection('users/' + auth().currentUser.uid + '/pets')
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
      var pet = new Pet()
      pet._id = documentSnapshot.id
      pet.name = documentSnapshot.data().name
      if (petsId.includes(pet._id)) {
        existPets.push(pet)
      } else {
        addingPets.push(pet)
      }
    });
    handleCallback(existPets, addingPets)
  }, onError);
}

export const getDateReminder = (date, handleCallback) => {
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

export const getMonthReminderDate = (date, handleCallback) => {
  console.log(date.getDate() + "/" +(date.getMonth() + 1) + "/" +  date.getFullYear());
  var dates = new Array()
  firestore()
  .collection('users/' + auth().currentUser.uid + '/reminders')
  .where('month', '==', date.getMonth() + 1)
  .where('year', '==', date.getFullYear())
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
      if (!(dates.includes(documentSnapshot.data().date))) {
        dates.push(documentSnapshot.data().date)
      }
    });
    handleCallback(sort(dates));
  }, onError);
}