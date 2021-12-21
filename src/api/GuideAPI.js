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

export const getRatedUserList = (id, handleCallback) => {
    firestore()
    .collection('camnang/' + id + '/UserRated')
    .get()
    .then(querySnapshot => {
        var list = new Array();
        querySnapshot.forEach(documentSnapshot => {
            list.push(documentSnapshot.data().id);
        })
        handleCallback(list);
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

export const rateGuide = (guide, rating, handleCallback) => {
    firestore()
    .collection('camnang')
    .doc(guide._id)
    .update({
        rating_count: (parseInt(guide.rating_count) + 1).toString(),
        rating: (Math.round(((guide.rating * parseInt(guide.rating_count) + rating) / (parseInt(guide.rating_count) + 1)) * 10) / 10).toString(),
    })
    .then(() => {
        addUserToRatedList(guide._id, handleCallback);
    })
    .catch((e) => {
        handleCallback(e);
    });
}

export const addUserToRatedList = (guideId, handleCallback) => {
    const userId = "gwjLJ986xHN56PLYQ0uYPWMOB7g1";

    firestore()
    .collection('camnang/' + guideId + "/UserRated")
    .add({
        id: userId,
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
}