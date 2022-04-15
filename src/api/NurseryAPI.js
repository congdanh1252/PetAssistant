import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import Nursery from "../models/nursery"
import Rating from "../models/rating"

export const getNurseryList = (province, type, level, handleCallback) => {
  console.log("Province: ", province)
  console.log("Type : ", type)
  console.log("Level : ", level)

  var nurseryList = new Array()
  firestore()
    .collection("nursery")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        handleCallback("empty")
      } else {
        querySnapshot.forEach((documentSnapshot) => {
          if (
            (documentSnapshot.data().level == level || level == "Tất cả") &&
            (documentSnapshot.data().type == type || type == "Tất cả") &&
            (documentSnapshot.data().province == province || province == "Toàn quốc")
          ) {
            console.log(documentSnapshot.data())
            let nursery = new Nursery()
            nursery.update(documentSnapshot.data())
            nursery._id = documentSnapshot.id
            nurseryList.push(nursery)
          }
        })
        handleCallback(nurseryList)
      }
    })
    .catch((e) => {
      handleCallback("error")
    })
}

export const getNurseryItem = (_id, handleCallback) => {
  firestore()
    .collection("nursery")
    .doc(_id)
    .get()
    .then((documentSnapshot) => {
      let nursery = new Nursery()
      nursery.update(documentSnapshot.data())
      nursery._id = documentSnapshot.id
      handleCallback(nursery)
    })
    .catch((e) => {
      handleCallback("error")
    })
}

export const getRatingList = (_id, handleCallback) => {
  var ratingList = new Array()
  firestore()
    .collection("nursery/" + _id + "/rating")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        handleCallback("empty")
      } else {
        querySnapshot.forEach((documentSnapshot) => {
          let rating = new Rating()
          rating.update(documentSnapshot.data())
          rating._id = documentSnapshot.id
          ratingList.push(rating)
        })
        handleCallback(ratingList)
      }
    })
    .catch((e) => {
      handleCallback("error")
    })
}
