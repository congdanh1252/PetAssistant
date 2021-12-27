import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import User from '../models/user';

export const getUserInfo = (handleCallback) => {
    var user = new User()

    firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .get()
    .then(documentSnapshot => {
        user.update(documentSnapshot.data())
        handleCallback(user)
    })
};


