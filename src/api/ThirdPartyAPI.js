import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ThirdParty from '../models/thirdParty';

export const getThirdPartyInfo = (id, handleCallback) => {
    firestore()
      .collection("thirdParty")
      .doc(id)
      .get()
      .then((documentSnapshot) => {
        var item = new ThirdParty()
        item.update(documentSnapshot.data())
        item._id = documentSnapshot.id
        handleCallback(item)
      })
  }

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

export const addNewAppointment = (apm, handleCallback) => {
    firestore()
    .collection('appointment')
    .add({
        third_party_id: apm.third_party_id,
        third_party_name: apm.third_party_name,
        third_party_thumbnail: apm.third_party_thumbnail,
        third_party_address: apm.third_party_address,
        customer_id: auth().currentUser.uid,
        customer_name: apm.customer_name,
        customer_phone_number: apm.customer_phone_number,
        service: apm.service,
        appointment_date: firestore.Timestamp.fromDate(apm.appointment_date),
        appointment_time: firestore.Timestamp.fromDate(apm.appointment_time),
        note: apm.note,
        createdAt: firestore.Timestamp.fromDate(new Date()),
        status: 'Chờ xác nhận',
        status_code: 0,
        has_feedback: false
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const addFeedbackToAppointment = (id, apmFb, handleCallback) => {
    firestore()
    .collection('appointment')
    .doc(id)
    .update({
        has_feedback: true,
        feedback: apmFb
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const updateFeedbackInThirdPartyProfile = (id, thirdParty, newRt, handleCallback) => {
    firestore()
    .collection('thirdParty')
    .doc(id)
    .update({
        feedback: thirdParty.feedback,
        rating: (Math.round(((parseFloat(thirdParty.rating) * parseInt(thirdParty.rating_count) + parseInt(newRt)) / (parseInt(thirdParty.rating_count) + 1)) * 10) / 10).toString(),
        rating_count: (parseInt(thirdParty.rating_count) + 1).toString(),
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};