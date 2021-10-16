import React, { useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';

export function PetProfileScreen() {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['45%', '80%'], []);
    
    const SettingButton = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={style.btn_container}
            >
                <Image
                    style={{tintColor: COLORS.white}}
                    source={require('../assets/icons/Settings.png')}
                />
            </TouchableOpacity>
        )
    }

    //Main 
    return (
        <View style={style.container}>
            <View style={style.pet_photo_conatainer}>
                <Image
                    style={style.pet_photos}
                    source={{uri: 'https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg'}}
                />

                <View style={style.header}>
                    <BackButton
                        container={'black'}
                    />

                    <SettingButton/>
                </View>
            </View>

            <BottomSheet
                index={0}
                snapPoints={snapPoints}
                enableOverDrag={false}
                style={style.information_container}
            >
                <View style={style.basic_information}>
                    {/* Name, breed, kind */}
                    <View style={style.name_gender_container}>
                        <Text style={style.pet_name}>
                            Pomeranian
                        </Text>

                        <Image
                            style={style.pet_gender}
                            source={require('../assets/icons/ic_female.png')}
                        />
                    </View>

                    <Text style={style.pet_kind_breed}>
                        Chihuahua - Thuần chủng
                    </Text>

                    {/* 3 boxes */}
                    <View style={style.boxes_container}>
                        {/* Age box */}
                        <View
                            style={[style.box_information, {backgroundColor: COLORS.pet_green}]}
                        >
                            <Text style={style.information_detail}>
                                1 năm
                            </Text>

                            <Text style={style.information_label}>
                                {strings.age}
                            </Text>
                        </View>

                        {/* Height box */}
                        <View
                            style={[style.box_information, {backgroundColor: COLORS.pet_blue}]}
                        >
                            <Text style={style.information_detail}>
                                30 cm
                            </Text>

                            <Text style={style.information_label}>
                                {strings.height}
                            </Text>
                        </View>

                        {/* Weight box */}
                        <View
                            style={[style.box_information, {backgroundColor: COLORS.pet_pink}]}
                        >
                            <Text style={style.information_detail}>
                                0.5 kg
                            </Text>

                            <Text style={style.information_label}>
                                {strings.weight}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Process */}
                <View style={style.process_information}>
                    
                </View>
            </BottomSheet>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1,
    },
    btn_container: {
        height: 50,
        width: 50,
        backgroundColor: COLORS.black,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        height: 50,
        width: '90%',
        position: 'absolute',
        top: 30,
        marginLeft: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    pet_photo_conatainer: {
        height: '58%',
    },
    pet_photos: {
        height: '100%',
    },
    information_container: {
        paddingLeft: 22,
        paddingRight: 22,
    },
    basic_information: {
        height: 220,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    name_gender_container: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pet_name: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
    },
    pet_gender: {
        height: 28,
        width: 28,
        marginLeft: 20,
    },
    pet_kind_breed: {
        color: COLORS.black,
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
        marginTop: 10,
    },
    boxes_container: {
        width: '100%',
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    box_information: {
        width: 110,
        height: 110,
        borderRadius: 32,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: COLORS.pet_pink,
    },
    information_detail: {
        color: COLORS.black,
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
    },
    information_label: {
        color: COLORS.black,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        opacity: 0.7,
    }
});