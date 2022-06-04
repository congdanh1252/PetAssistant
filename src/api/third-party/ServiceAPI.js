import firestore from "@react-native-firebase/firestore"
import ServiceItem from "../../models/serviceItem"
import auth from "@react-native-firebase/auth"

function onError(error) {
  console.error(error)
}

export const getServices = (handleServices) => {
  var services = new Array()
  firestore()
    .collection("thirdParty/" + auth().currentUser.uid + "/service")
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
            let service = new ServiceItem()
            service.update(documentSnapshot.data())
            service._id = documentSnapshot.id
            services.push(service)
        })
        handleServices(services)
    }, onError)
}
