import firestore from '@react-native-firebase/firestore';

export const getSavedGuides = (handleCallback) => {
    firestore()
    .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/guides')
    .get()
    .then(querySnapshot => {
        var guide_list = new Array();
        querySnapshot.forEach(documentSnapshot => {
            guide_list.push(documentSnapshot.data().id);
        })
        handleCallback(guide_list);
    })
};

export const addGuideToSavedList = (id, handleCallback) => {
    firestore()
    .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/guides')
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

export const deleteGuideFromSavedList = (id, handleCallback) => {
    firestore()
    .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/guides')
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