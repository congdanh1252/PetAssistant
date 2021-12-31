import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

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


