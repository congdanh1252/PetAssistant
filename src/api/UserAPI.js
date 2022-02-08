import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import User from '../models/user';

export const updateUserName = (name, handleCallback) => {
    firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .update({
        name: name
    })
    .then(() => {
        handleCallback()
    })
}

export const getUserName = (handleCallback) => {
    firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .get()
    .then(documentSnapshot => {
        var user = new User()
        user.update(documentSnapshot.data())
        handleCallback(user)
    })
}