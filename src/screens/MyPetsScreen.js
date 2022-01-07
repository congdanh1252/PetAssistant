import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import Pet from '../models/pet';

const MyPetsScreen = ({route, navigation}) => {
    const [chosenKind, setChosenKind] = useState(strings.all);
    const [petKind, setPetKind] = useState([]);
    const [myPet, setMyPet] = useState([]);

    const handlePets = (petList) => {
        var kinds = [];
        var pets = [];
        petList.forEach((pet) => {
            pets.push(pet);

            if (!kinds.includes(pet.kind)) {
                kinds.push(pet.kind);
            }
        });

        setMyPet(pets);
        setPetKind(kinds);
    }

    //load pet list
    useEffect(() => {
        const subscriber = firestore()
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

        return () => subscriber();
    }, []);

    const PetKinds = () => {
        var kinds = [];
        for (let i = 0; i < petKind.length + 1; i++) {
            if (i == 0) {
                kinds.push(
                    <TouchableOpacity
                        key={i}
                        style={
                            chosenKind==strings.all ?
                            style.animal_kind : [style.animal_kind, {opacity: 0.5}]
                        }
                        activeOpacity={0.8}
                        onPress={() => {
                            setChosenKind(strings.all);
                        }}
                    >
                        <Image
                            style={[style.animal_icon, {tintColor: COLORS.black}]}
                            source={require('../assets/icons/ic_menu.png')}
                        />

                        <Text style={style.animal_name}>{strings.all}</Text>
                    </TouchableOpacity>
                );
            }
            else {
                //Find correct animal kind icon
                var icon;
                switch (petKind[i-1]) {
                    case 'Chó':
                        icon = require('../assets/icons/ic_dog.png');
                        break;
                    case 'Mèo':
                        icon = require('../assets/icons/ic_cat.png');
                        break;
                    case 'Chim':
                        icon = require('../assets/icons/ic_bird.png');
                        break;
                    case 'Rắn':
                        icon = require('../assets/icons/ic_snake.png');
                        break;
                    case 'Hamster':
                        icon = require('../assets/icons/ic_hamster.png');
                        break;
                    default:
                        icon = require('../assets/icons/Logo.png')
                }

                kinds.push(
                    <TouchableOpacity
                        key={i}
                        style={
                            chosenKind==petKind[i-1] ?
                            style.animal_kind : [style.animal_kind, {opacity: 0.5}]
                        }
                        activeOpacity={0.8}
                        onPress={() => {
                            setChosenKind(petKind[i-1]);
                        }}
                    >
                        <Image
                            style={style.animal_icon}
                            source={icon}
                        />

                        <Text style={style.animal_name}>{petKind[i-1]}</Text>
                    </TouchableOpacity>
                )
            }
        }
        
        return (
            <View style={style.animal_kind_holder}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {kinds}
                </ScrollView>
            </View>
        )
    }

    const MyPets = () => {
        var pets = [];
        var pets_chosen_kind = [];

        for (let i = 0; i < myPet.length; i++) {
            if (chosenKind == strings.all) {
                pets_chosen_kind = myPet;
            }
            else if (myPet[i].kind == chosenKind) {
                pets_chosen_kind.push(myPet[i]);    
            }
        }

        for (let i = 0; i < pets_chosen_kind.length; i++) {
            var mod = (i + 3) % 3;
            var color;

            switch (mod) {
                case 1:
                    color = COLORS.pet_blue;
                    break;
                case 2:
                    color = COLORS.pet_pink;
                    break;
                default:
                    color = COLORS.pet_green;
            }

            pets.push(
                <TouchableOpacity
                    key={i}
                    style={[style.pet_holder, {backgroundColor: color}]}
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate('PetProfile', {pet_id: pets_chosen_kind[i]._id});
                    }}
                >
                    <Image
                        style={style.pet_photo}
                        source={{uri: pets_chosen_kind[i].photo}}
                    />

                    <View
                        style={{
                            width: '50%',
                            alignItems: 'center',
                            padding: 15,
                        }}
                    >
                        <Text style={style.pet_name}>{pets_chosen_kind[i].name}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {pets}
            </ScrollView>
        )
    }

    //Main 
    return (
        <View style={style.screen}>
            <View style={style.header}>
                <BackButton
                    container={'trans'}
                    navigation={navigation}
                />

                <Text style={style.headerTitle}>{strings.my_pet}</Text>
            </View>

            <View style={style.container}>
                <View style={style.animals}>
                    <Text style={style.title}>{strings.animal_kind}</Text>

                    <PetKinds/>
                </View>

                <View style={style.my_pets}>
                    <Text style={style.title}>{strings.my_pet}</Text>

                    {
                        myPet.length > 0 ?
                        <MyPets/>
                        :
                        <Text
                            style={{
                                color: COLORS.black,
                                fontFamily: 'Roboto-Light',
                                fontSize: 16,
                                textAlign: 'center',
                                marginTop: 12,
                            }}
                        >
                            {myPet.length > 0 ? 'Hãy bắt đầu thêm thú cưng mới để theo dõi bạn nhé!' : ''}
                        </Text>
                    }
                </View>
            </View>

            <TouchableOpacity
                style={style.floating_button}
                activeOpacity={0.7}
                onPress={() => {
                    navigation.navigate('AddPet', {
                        action: 'add',
                        petObj: null,
                    });
                }}
            >
                <Image
                    source={require('../assets/icons/Add.png')}
                    style={style.add_btn}
                />
            </TouchableOpacity>
        </View>
    );
}

export default MyPetsScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        paddingTop: 0,
        paddingLeft: 22,
        paddingRight: 22,
        paddingBottom: 22,
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: COLORS.white,
    },
    header: {
        width: '100%',
        height: 110,
        paddingTop: 16,
        paddingLeft: 8,
        flexDirection: 'row',
        backgroundColor: COLORS.dark,
    },
    headerTitle: {
        width: '76%',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 22,
        marginTop: 16,
        color: COLORS.white,
    },
    animals: {
        height: '20%',
        marginTop: 20,
    },
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        marginBottom: 12,
    },
    animal_kind_holder: {
        height: '56%',
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.white,
    },
    animal_kind: {
        height: 64,
        width: 70,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
        backgroundColor: COLORS.white,
    },
    animal_icon: {
        width: 32,
        height: 32,
    },
    animal_name: {
        color: COLORS.black,
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
    my_pets: {
        height: '66%',
        marginTop: 8,
    },
    pet_holder: {
        height: 130,
        marginBottom: 18,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pet_photo: {
        height: 130,
        width: '50%',
        borderRadius: 15,
    },
    pet_name: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
    },
    floating_button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        position: 'absolute',
        bottom: 16,
        left: '45%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    add_btn: {
        width: 56,
    }
});