import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import MarketItem from "../models/MarketItem"

export const getMarketList = (province, kind, handleCallback) => {
  console.log("Province: ", province)
  console.log("Kind : ", kind)

  var marketList = new Array()
  firestore()
    .collection("market")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        handleCallback("empty")
      } else {
        querySnapshot.forEach((documentSnapshot) => {
          if (
            (documentSnapshot.data().kind == kind || kind == "Tất cả") &&
            (documentSnapshot.data().province == province ||
              province == "Toàn quốc")
          ) {
            console.log(documentSnapshot.data());
            let marketItem = new MarketItem()
            marketItem.update(documentSnapshot.data())
            marketItem._id = documentSnapshot.id
            marketList.push(marketItem)
          }
        })
        handleCallback(marketList)
      }
    })
    .catch((e) => {
      handleCallback("error")
    })
}

export const getMarketItem = (_id, handleCallback) => {
  firestore()
    .collection("market")
    .doc(_id)
    .get()
    .then((documentSnapshot) => {
      let marketItem = new MarketItem()
      marketItem.update(documentSnapshot.data())
      marketItem._id = documentSnapshot.id
      handleCallback(marketItem)
    })
    .catch((e) => {
      handleCallback("error")
    })
}
