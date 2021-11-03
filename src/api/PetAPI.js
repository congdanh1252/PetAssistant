import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Pet from '../models/pet';

function onError(error) {
  console.error(error);
}

export const getPetList = (handlePets) => {
  var petList = new Array();

  firestore()
  .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/pets')
  .get()
  .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
        var pet = new Pet();
        pet.update(documentSnapshot.data())
        pet.birthday = documentSnapshot.data().dob.toDate()
        pet._id = documentSnapshot.id;
        petList.push(pet);
    });

    handlePets(petList);
  }, onError);
}

export const uploadImageToStorage = async (uri, name, handleImageUrl) => {
    let reference = storage().ref(`${name}`);
    let task = reference.putFile(uri);
    task.then(() => {
        console.log('Image uploaded to the bucket!');
    
        reference.getDownloadURL()
        .then((url) => {
            handleImageUrl(url);
        })
        .catch((e) => {
            console.log('get downloadUrl error => ', e);
        })
    })
    .catch((e) => {
        console.log('uploading image error => ', e);
    });
};

export const addPetToFirestore = (pet, handlePetAdded) => {
    firestore()
    .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/pets')
    .add({
        name: pet.name,
        kind: pet.kind,
        gender: pet.gender,
        species: pet.species,
        dob: firestore.Timestamp.fromDate(pet.birthday),
        breed: pet.breed,
        status: pet.status,
        height: pet.height,
        weight: pet.weight,
        photo: pet.photo,
    })
    .then(() => {
        handlePetAdded('Success');
    })
    .catch((e) => {
        handlePetAdded(e);
    });
}