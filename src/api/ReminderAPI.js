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
  console.log(reminder);
  firestore()
  .collection('users/' + auth().currentUser.uid + '/reminders')
  .add(reminder)
  .then(docRef => {
    console.log("Added")
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
  .where('frequency', '==', 'custom')
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

      // Monthly
      firestore()
      .collection('users/' + auth().currentUser.uid + '/reminders')
      .where('frequency', '==', 'monthly')
      .where('date', '==', date.getDate())
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
              var reminder = new Reminder();
              reminder.update(documentSnapshot.data())
              reminder.datetime.setDate(date.getDate())
              reminder.datetime.setMonth(date.getMonth()) 
              reminder.datetime.setFullYear(date.getFullYear()) 
              console.log(reminder);
              if (reminder.datetime > new Date()) {
                  remindersList.push(reminder)
              } else {
                  oldRemindersList.push(reminder)
              }
          });

          // Yearly
          firestore()
          .collection('users/' + auth().currentUser.uid + '/reminders')
          .where('month', '==', date.getMonth() + 1)
          .where('date', '==', date.getDate())
          .where('frequency', '==', 'yearly')
          .get()
          .then(querySnapshot => {
              querySnapshot.forEach(documentSnapshot => {
                  var reminder = new Reminder();
                  reminder.update(documentSnapshot.data())
                  reminder.datetime.setDate(date.getDate())
                  reminder.datetime.setMonth(date.getMonth()) 
                  reminder.datetime.setFullYear(date.getFullYear()) 
                  if (reminder.datetime > new Date()) {
                      remindersList.push(reminder)
                  } else {
                      oldRemindersList.push(reminder)
                  }
              });

              // Daily
              firestore()
              .collection('users/' + auth().currentUser.uid + '/reminders')
              .where('frequency', '==', 'daily')
              .get()
              .then(querySnapshot => {
                  querySnapshot.forEach(documentSnapshot => {
                      var reminder = new Reminder();
                      reminder.update(documentSnapshot.data())
                      reminder.datetime.setDate(date.getDate()) 
                      reminder.datetime.setMonth(date.getMonth()) 
                      reminder.datetime.setFullYear(date.getFullYear()) 
                      if (reminder.datetime > new Date()) {
                          remindersList.push(reminder)
                      } else {
                          oldRemindersList.push(reminder)
                      }
                  });
                  handleCallback(sort(remindersList), sort(oldRemindersList));
              }, onError);
          }, onError);
      }, onError);
  }, onError);
}

export const getMonthReminderDate = (date, handleCallback) => {
  console.log(date.getDate() + "/" +(date.getMonth() + 1) + "/" +  date.getFullYear());
  var dates = new Array()

  // Get no-repeat
  firestore()
  .collection('users/' + auth().currentUser.uid + '/reminders')
  .where('month', '==', date.getMonth() + 1)
  .where('year', '==', date.getFullYear())
  .where('frequency', '==', 'custom')
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
      if (!(dates.includes(documentSnapshot.data().date))) {
        dates.push(documentSnapshot.data().date)
      }
    });

    // Get monthly
    firestore()
    .collection('users/' + auth().currentUser.uid + '/reminders')
    .where('frequency', '==', 'monthly')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        if (!(dates.includes(documentSnapshot.data().date))) {
          dates.push(documentSnapshot.data().date)
        }
      });

      // Get yearly
      firestore()
      .collection('users/' + auth().currentUser.uid + '/reminders')
      .where('month', '==', date.getMonth() + 1)
      .where('frequency', '==', 'yearly')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (!(dates.includes(documentSnapshot.data().date))) {
            dates.push(documentSnapshot.data().date)
          }
        });
        handleCallback(sort(dates));
      }, onError);
    }, onError);
  }, onError);
}

export const getCoreReminder = (handleCallback) => {
  var reminders = new Array()
  firestore()
  .collection('users/' + auth().currentUser.uid + '/reminders')
  .where('month', '==', date.getMonth() + 1)
  .where('reminderType', '==', 'core')
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
      var reminder = new Reminder()
      reminder.update(documentSnapshot.data())
      reminders.push(reminder)
    });
    handleCallback(reminders);
  }, onError);
}

export const updateCorePets = (reminder, handleCallback) => {
  firestore()
  .collection('users/' + auth().currentUser.uid + '/reminders')
  .doc(reminder._id)
  .update({
    pets: reminder.pets
  })
  .then(() => {
    handleCallback()
  });
}