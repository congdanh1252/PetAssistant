import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import MarketItem from "../models/MarketItem"

export const getMarketList = (province, kind, species, handleCallback) => {
  console.log("Province: ", province)
  console.log("Kind : ", kind)
  console.log("Species : ", species)

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
            (documentSnapshot.data().species == species ||
              species == "Tất cả") &&
            (documentSnapshot.data().kind == kind || kind == "Tất cả") &&
            (documentSnapshot.data().province == province ||
              province == "Toàn quốc")
          ) {
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

export const deleteMarketItem = (id, handleCallback) => {
  firestore()
  .collection('market')
  .doc(id)
  .delete()
  .then((e) => {
      handleCallback('success')
  })
  .catch((e) => {
      handleCallback(e);
  });
}

export const updateMarketItem = (pet, handleCallback) => {
  firestore()
  .collection('market')
  .doc(pet._id)
  .update({
      name: pet.name,
      kind: pet.kind,
      gender: pet.gender,
      species: pet.species,
      height: pet.height,
      weight: pet.weight,
      age: firestore.Timestamp.fromDate(pet.age),
      price: pet.price,
      discount_price: pet.discount_price,
      description: pet.description,
  })
  .then(() => {
      handleCallback('Success');
  })
  .catch((e) => {
      handleCallback(e);
  });
};