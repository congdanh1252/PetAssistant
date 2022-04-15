import firestore from "@react-native-firebase/firestore"
import storage from "@react-native-firebase/storage"
import auth from "@react-native-firebase/auth"

import User from "../models/user"

export const updateUserName = (name, handleCallback) => {
  firestore()
    .collection("users")
    .doc(auth().currentUser.uid)
    .update({
      name: name,
    })
    .then(() => {
      handleCallback()
    })
}

export const getUserName = (handleCallback) => {
  firestore()
    .collection("users")
    .doc(auth().currentUser.uid)
    .get()
    .then((documentSnapshot) => {
      var user = new User()
      user.update(documentSnapshot.data())
      handleCallback(user)
    })
}

export const getUserInfo = (id, handleCallback) => {
  console.log(id)
  firestore()
    .collection("users")
    .doc(id)
    .get()
    .then((documentSnapshot) => {
      var user = new User()
      user.update(documentSnapshot.data())
      user._id = documentSnapshot.id
      handleCallback(user)
    })
}
