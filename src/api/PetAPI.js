import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Pet from '../models/pet';

export const getPetList = (handlePets) => { 
    var petList = new Array();

    firestore()
    .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/pets')
    .onSnapshot(querySnapshot => {
        var petList = new Array();
        querySnapshot.forEach(documentSnapshot => {
            var pet = new Pet();
            pet.update(documentSnapshot.data());
            pet.birthday = new Date(documentSnapshot.data().dob.toDate());
            pet._id = documentSnapshot.id;
            petList.push(pet);
        })
        handlePets(petList);
    })
};

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
};

export const updatePetInFirestore = (pet, handlePetUpdated) => {
    firestore()
    .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/pets')
    .doc(pet._id)
    .update({
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
        handlePetUpdated('Success');
    })
    .catch((e) => {
        handlePetUpdated(e);
    });
};

export const deletePetFromFirestore = (id, photoUrl, handlePetDeleted) => {
    firestore()
    .collection('users/gwjLJ986xHN56PLYQ0uYPWMOB7g1/pets')
    .doc(id)
    .delete()
    .then(() => {
        deleteImageFromStorage(photoUrl);
        handlePetDeleted('Success');
    })
    .catch((e) => {
        handlePetDeleted(e);
    });
};

export const deleteImageFromStorage = (url) => {
    var imgRef = storage().refFromURL(url);

    imgRef.delete().then(() => {
        console.log('pet photo deleted!')
    }).catch((error) => {
        console.log('Error deleting pet photo: ' + error);
    });
};

export const getPetName = (id, handleCallback) => {
    firestore()
    .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/pets')
    .doc(id)
    .get()
    .then(documentSnapshot => {
        handleCallback(documentSnapshot.data().name);
    }, onError);
}