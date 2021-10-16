import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';

export function MyPetsScreen() {
    const [chosenKind, setChosenKind] = useState(strings.all);
    const petKind = [
        'Chó',
        'Mèo',
        'Chim',
        'Chuột'
    ];
    const myPet = [
        {
            name: 'Goofy',
            kind: 'Mèo',
            photo: 'https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg',
        },
        {
            name: 'Oggy',
            kind: 'Chó',
            photo: 'https://www.thesprucepets.com/thmb/sfuyyLvyUx636_Oq3Fw5_mt-PIc=/3760x2820/smart/filters:no_upscale()/adorable-white-pomeranian-puppy-spitz-921029690-5c8be25d46e0fb000172effe.jpg',
        },
        {
            name: 'Jack',
            kind: 'Chó',
            photo: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*',
        }
    ];

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
        <View style={style.container}>
            <View style={style.header}>
                <BackButton
                    container={'black'}
                />

                <Image style={style.logo} source={require('../assets/icons/Logo.png')}/>
            </View>

            <View style={style.animals}>
                <Text style={style.title}>{strings.animal_kind}</Text>

                <PetKinds/>
            </View>

            <View style={style.my_pets}>
                <Text style={style.title}>{strings.my_pet}</Text>

                <MyPets/>
            </View>

            <TouchableOpacity
                style={style.floating_button}
                activeOpacity={0.7}
            >
                <Image
                    source={require('../assets/icons/Add.png')}
                    style={style.add_btn}
                />
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1,
        padding: 22,
    },
    header: {
        height: 80,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 100 / 2,
    },
    animals: {
        height: '20%',
        marginTop: 20,
    },
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 22,
        marginBottom: 15,
    },
    animal_kind_holder: {
        height: '60%',
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.black,
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
        height: '58%',
        marginTop: 24,
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
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
    },
    floating_button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        position: 'absolute',
        bottom: 12,
        left: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    add_btn: {
        width: 56,
    }
});