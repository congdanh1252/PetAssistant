import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { deleteImageFromStorage } from './PetAPI';

export const addVaccineToFirestore = (vaccine, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets/' + vaccine.pet_id + '/vaccination')
    .add({
        pet_id: vaccine.pet_id,
        type: vaccine.type,
        detail: vaccine.detail,
        label_photo: vaccine.label_photo,
        taken_date: firestore.Timestamp.fromDate(vaccine.taken_date),
        retake_date: firestore.Timestamp.fromDate(vaccine.retake_date),
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const updateVaccineInFirestore = (vaccine, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets/' + vaccine.pet_id + '/vaccination')
    .doc(vaccine._id)
    .update({
        type: vaccine.type,
        detail: vaccine.detail,
        label_photo: vaccine.label_photo,
        taken_date: firestore.Timestamp.fromDate(vaccine.taken_date),
        retake_date: firestore.Timestamp.fromDate(vaccine.retake_date),
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const deleteVaccineFromFirestore = (vaccine, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets/' + vaccine.pet_id + '/vaccination')
    .doc(vaccine._id)
    .delete()
    .then(() => {
        deleteImageFromStorage(vaccine.label_photo);
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};