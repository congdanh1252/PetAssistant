import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import Pet from '../models/pet';

export const getSpeciesList = (handleCallback) => {
    var species = {
        dog: [],
        cat: [],
        bird: [],
        hamster: [],
    }

    firestore()
    .collection('petSpecies')
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
            switch (documentSnapshot.id) {
                case 'dog':
                    species.dog = species.dog.concat(species.dog, documentSnapshot.data().name);
                    break;
                case 'cat':
                    species.cat = species.cat.concat(species.cat, documentSnapshot.data().name);
                    break;
                case 'bird':
                    species.bird = species.bird.concat(species.bird, documentSnapshot.data().name);
                    break;
                default:
                    species.hamster = species.hamster.concat(species.hamster, documentSnapshot.data().name);
            }
        })
        handleCallback(species);
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

export const uploadMultipleImagesToStorage = async (uriArr, fNameArr, handleCallback) => {
    let urlArr = [];

    for (let i = 0; i < uriArr.length; i++) {
        const reference = storage().ref(`${fNameArr[i]}`)
        let task = reference.putFile(uriArr[i]);
        task.then(() => {
            console.log('Image ' + i + ' uploaded to the bucket!');
        
            reference.getDownloadURL()
            .then((url) => {
                console.log(url);
                urlArr.push(url)

                if (urlArr.length == uriArr.length) {
                    handleCallback(urlArr)
                }
            })
            .catch((e) => {
                console.log('get downloadUrl error => ', reference.name);
            })
        })
        .catch((e) => {
            console.log('uploading image error => ', e);
        });
    }
}

export const addPetToFirestore = (pet, handlePetAdded) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets')
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
    .collection('users/' + auth().currentUser.uid + '/pets')
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
    .collection('users/' + auth().currentUser.uid + '/pets')
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

export const addSellPetToFirestore = (pet, handlePetAdded) => {
    firestore()
    .collection('market')
    .add({
        name: pet.name,
        kind: pet.kind,
        gender: pet.gender,
        species: pet.species,
        height: pet.height,
        weight: pet.weight,
        photo: pet.photo,
        price: pet.price,
        discount_price: pet.discount_price,
        description: pet.description,
        additional_photos: pet.additional_photos,
        seller_id: auth().currentUser.uid
    })
    .then(() => {
        handlePetAdded('Success');
    })
    .catch((e) => {
        handlePetAdded(e);
    });
};

export const getPetName = (id, handleCallback) => {
    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets')
    .doc(id)
    .get()
    .then(documentSnapshot => {
        handleCallback(documentSnapshot.data().name);
    }, onError);
}

export const getPetList = (handlePets) => { 
    var petList = new Array();

    firestore()
    .collection('users/' + auth().currentUser.uid + '/pets')
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