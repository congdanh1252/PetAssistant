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

export const addTreatmentToFirestore = (treatment, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets/' + treatment.pet_id + '/treatment')
    .add({
        pet_id: treatment.pet_id,
        detail: treatment.detail,
        medicine: treatment.medicine,
        taken_date: firestore.Timestamp.fromDate(treatment.taken_date),
        note: treatment.note,
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const updateTreatmentInFirestore = (treatment, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets/' + treatment.pet_id + '/treatment')
    .doc(treatment._id)
    .update({
        detail: treatment.detail,
        medicine: treatment.medicine,
        taken_date: firestore.Timestamp.fromDate(treatment.taken_date),
        note: treatment.note,
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const deleteTreatmentFromFirestore = (treatment, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets/' + treatment.pet_id + '/treatment')
    .doc(treatment._id)
    .delete()
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};