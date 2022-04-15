import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const getSavedThirdParties = (handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/thirdParties')
    .get()
    .then(querySnapshot => {
        var list = new Array();
        querySnapshot.forEach(documentSnapshot => {
            list.push(documentSnapshot.data().id);
        })
        handleCallback(list);
    })
};

export const getRatedUserList = (id, handleCallback) => {
    // firestore()
    // .collection('camnang/' + id + '/UserRated')
    // .get()
    // .then(querySnapshot => {
    //     var list = new Array();
    //     querySnapshot.forEach(documentSnapshot => {
    //         list.push(documentSnapshot.data().id);
    //     })
    //     handleCallback(list);
    // })
};

export const addThirdPartyToSavedList = (id, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/thirdParties')
    .add({
        id: id,
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const deleteThirdPartyFromSavedList = (id, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/thirdParties')
    .where('id', '==', id)
    .get()
    .then(querySnapshot => {
        querySnapshot.docs[0].ref.delete();
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};