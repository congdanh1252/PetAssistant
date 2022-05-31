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

export const addTotalAmountToAppointment = (id, amount, handleCallback) => {
    firestore()
    .collection('appointment')
    .doc(id)
    .update({
        total_amount: parseInt(amount)
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

export const updateThirdPartyInformation = (id, thirdParty, handleCallback) => {
    firestore()
    .collection('thirdParty')
    .doc(id)
    .update({
        name: thirdParty.name,
        address: thirdParty.address,
        category: thirdParty.category,
        phone_number: thirdParty.phone_number,
        thumbnail: thirdParty.thumbnail,
        img: thirdParty.img
    })
    .then(() => {
        handleCallback('Success');
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const updateMultipleServices = async (thirdParty, actions, handleCallback) => {
    var sum = 0;

    for (let i = 0; i < thirdParty.service.length; i++) {
        switch (actions[i]) {
            case 'none':
                break;
            case 'add':
                firestore()
                .collection('thirdParty/' + thirdParty._id + '/service')
                .add({
                    active: true,
                    detail: thirdParty.service[i].detail,
                    price: thirdParty.service[i].price,
                    description: thirdParty.service[i].description
                })
                .then(() => {
                    sum++;
                    console.log('Add service ok!')
                    if (i==thirdParty.service.length - 1) {
                        handleCallback('Success')
                    }
                })
                .catch((e) => {
                    handleCallback(e);
                });
                break;
            case 'remove':
                firestore()
                .collection('thirdParty/' + thirdParty._id + '/service')
                .doc(thirdParty.service[i]._id)
                .update({
                    active: false,
                })
                .then(() => {
                    sum++;
                    console.log('Remove service ok!')
                    if (i==thirdParty.service.length - 1) {
                        handleCallback('Success')
                    }
                })
                .catch((e) => {
                    handleCallback(e);
                });
                break;
            default:
                firestore()
                .collection('thirdParty/' + thirdParty._id + '/service')
                .doc(thirdParty.service[i]._id)
                .update({
                    detail: thirdParty.service[i].detail,
                    price: thirdParty.service[i].price,
                    description: thirdParty.service[i].description
                })
                .then(() => {
                    sum++;
                    console.log('Edit service ok!')
                    if (i==thirdParty.service.length - 1) {
                        handleCallback('Success')
                    }
                })
                .catch((e) => {
                    handleCallback(e);
                });
        }
    }
}

export const proceedAppointment = (id, currentCode, amount, handleCallback) => {
    var newCode = 0
    var newStatus = ''

    switch (currentCode) {
        case 0:
            newCode = 1
            newStatus = 'Đã xác nhận' 
            break
        case 1:
            newCode = 2
            newStatus = 'Thành công' 
            break
        default:
            newCode = 3
            newStatus = 'Đã hủy' 
    }

    firestore()
    .collection('appointment')
    .doc(id)
    .update({
        status: newStatus,
        status_code: newCode
    })
    .then(() => {
        if (newCode == 2) {
            addTotalAmountToAppointment(id, amount, (res) => {
                if (res == 'Success') {
                    handleCallback({
                        res: 'success',
                        newCode: newCode,
                        newStatus: newStatus
                    });
                }
            })
        } else {
            handleCallback({
                res: 'success',
                newCode: newCode,
                newStatus: newStatus
            });
        }
    })
    .catch((e) => {
        handleCallback(e);
    });
}