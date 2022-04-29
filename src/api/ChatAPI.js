import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const getChatId = (user2, handleCallback) => {
    firestore()
    .collection('chat')
    .where('user1', '==', auth().currentUser.uid)
    .get()
    .then(querySnapshot => {
        if (querySnapshot.empty) {
            handleCallback('empty')
        }
        else {
            querySnapshot.forEach(documentSnapshot => {
                if (documentSnapshot.data().user2 === user2) {
                    handleCallback(documentSnapshot.id);
                }
            })
        }
    })
    .catch((e) => {
        handleCallback('error');
    })
}

export const addNewMessageToChat = (detail, attachment, chatId, handleCallback) => {
    firestore()
    .collection('chat/' + chatId + '/messages')
    .add({
        detail: detail,
        attachment: attachment,
        sender: auth().currentUser.uid,
        createdAt: firestore.Timestamp.fromDate(new Date())
    })
    .then(() => {
        updateLastMessage(chatId, detail == '' ? '[Ảnh]' : detail, (res) => {
            if (res == 'Success') {
                handleCallback('Success');
            }
        })
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const addNewChat = (user2, name, img, handleCallback) => {
    firestore()
    .collection('chat')
    .add({
        user1: auth().currentUser.uid,
        user2: user2,
        lastMessage: '',
        user2Name: name,
        user2Image: img,
        updatedAt: firestore.Timestamp.fromDate(new Date()),
        createdAt: firestore.Timestamp.fromDate(new Date())
    })
    .then(() => {
        getChatId(user2, (res) => {
            handleCallback(res);
        })
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const deleteChat = (id, handleCallback) => {
    firestore()
    .collection('chat')
    .doc(id)
    .delete()
    .then((e) => {
        handleCallback('Success')
    })
    .catch((e) => {
        handleCallback(e);
    });
};

export const updateLastMessage = (chatId, lastMsg, handleCallback) => {
    firestore()
    .collection('chat')
    .doc(chatId)
    .update({
        lastMessage: lastMsg,
        updatedAt: firestore.Timestamp.fromDate(new Date())
    })
    .then(() => {
        handleCallback('Success')
    })
    .catch((e) => {
        handleCallback(e);
    });
};