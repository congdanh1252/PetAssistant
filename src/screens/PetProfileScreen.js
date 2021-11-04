import React, { useMemo, useRef, useState, useEffect } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import Toast from "react-native-toast-message";
import Dialog from "react-native-dialog";
import {
    Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, LogBox,
    TouchableHighlight, TouchableWithoutFeedback
} from 'react-native';

import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const PetProfileScreen = ({route, navigation}) => {
    const [petAge, setPetAge] = useState('');
    const [setting, setSetting] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['45%', '80%'], []);
    const snapPointsDropdown = useMemo(() => ['19%', '19%'], []);

    const { pet } = route.params;

    //Find correct animal kind icon
    const GenderIcon = () => {
        var icon;
        switch (pet.gender) {
            case 'Đực':
                icon = require('../assets/icons/ic_male.png');
                break;
            case 'Cái':
                icon = require('../assets/icons/ic_female.png');
                break;
            default:
                icon = require('../assets/icons/ic_question.png')
        }

        return (
            <Image
                style={style.pet_gender}
                source={icon}
            />
        )
    }

    //Calculate age in year
    useEffect(() => {
        var isMounted = true;
        if (isMounted) {
            var bornDays = Math.abs(new Date() - pet.birthday) / 86400000;
            var age = Math.round(bornDays / 365);
            var ageWithoutRound = (bornDays / 365) - age;
            if (ageWithoutRound === 0) {
                setPetAge(age);
            } else {
                setPetAge('<' + age);
            }
        }
        
        return () => {
            isMounted = false;
        }
    }, []);
    
    const SettingButton = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={style.btn_container}
                onPress={() => {
                    setSetting('Open');
                }}
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
                    source={{uri: pet.photo}}
                />

                <View style={style.header}>
                    <BackButton
                        container={'black'}
                        navigation={navigation}
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
                            {pet.name}
                        </Text>

                        <GenderIcon/>
                    </View>

                    <Text style={style.pet_kind_breed}>
                        {pet.species}  •  {pet.breed}
                    </Text>

                    {/* 3 boxes */}
                    <View style={style.boxes_container}>
                        {/* Age box */}
                        <View
                            style={[style.box_information, {backgroundColor: COLORS.pet_green}]}
                        >
                            <Text style={style.information_detail}>
                                {petAge} năm
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
                                {pet.height} cm
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
                                {pet.weight} kg
                            </Text>

                            <Text style={style.information_label}>
                                {strings.weight}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Process */}
                <View style={style.care_information}>
                    <Text style={style.section_title}>
                        {strings.care_title}
                    </Text>
                </View>
            </BottomSheet>

            {/* Overlay and Settings dropdown bottomsheet */}
            {
                setting=='' ?
                    (null)
                :
                    (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setSetting('')
                            }}
                        >
                            <View style={style.overlay}>
                                <BottomSheet
                                    index={1}
                                    snapPoints={snapPointsDropdown}
                                    style={style.dropdown_bottomsheet}
                                    enableOverDrag={false}
                                    enablePanDownToClose={true}
                                    onClose={() => setSetting('')}
                                >
                                    <TouchableHighlight
                                        key={1}
                                        activeOpacity={0.7}
                                        underlayColor='#EEEEEE'
                                        style={style.dropdown_option}
                                        onPress={() => {

                                        }}
                                    >
                        
                                        <View style={style.dropdown_detail}>
                                            <Image
                                                style={style.dropdown_option_icon}
                                                source={require('../assets/icons/ic_edit.png')}
                                            />

                                            <Text style={style.dropdown_option_text}>
                                                {strings.edit_pet_info}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>

                                    <TouchableHighlight
                                        key={2}
                                        activeOpacity={0.7}
                                        underlayColor='#EEEEEE'
                                        style={style.dropdown_option}
                                        onPress={() => {
                                            setDialogVisible(true);
                                            setSetting('');
                                        }}
                                    >
                        
                                        <View style={style.dropdown_detail}>
                                            <Image
                                                style={style.dropdown_option_icon}
                                                source={require('../assets/icons/ic_bin.png')}
                                            />

                                            <Text style={style.dropdown_option_text}>
                                                {strings.delete_pet}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                </BottomSheet>
                            </View>
                        </TouchableWithoutFeedback>
                    )
            }

            <Toast ref={(ref) => Toast.setRef(ref)} />

            {/* Delete pet dialog */}
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title
                    style={{fontFamily: 'Roboto-Bold'}}
                >
                    {strings.delete_pet}
                </Dialog.Title>

                <Dialog.Description>
                    {strings.delete_pet_msg}
                </Dialog.Description>

                <Dialog.Input placeholder={'Nhập tên thú cưng'}/>

                <Dialog.Button
                    color={COLORS.black}
                    label={strings.cancel}
                    onPress={() => {
                        setDialogVisible(false);
                    }}
                />

                <Dialog.Button
                    color={COLORS.black}
                    label={strings.sure}
                    onPress={() => {

                    }}
                />
            </Dialog.Container>
        </View>
    );
}

export default PetProfileScreen;

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
    },
    section_title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 22,
        marginBottom: 15,
    },
    care_information: {
        marginTop: 20,
    },
    dropdown_bottomsheet: {
        borderRadius: 10,
    },
    dropdown_option: {
        width: '100%',
        height: 60,
        padding: 24,
        justifyContent: 'center',
        borderBottomWidth: 1.5,
        borderColor: COLORS.grey,
    },
    dropdown_detail: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    dropdown_option_icon: {
        height: 20,
        width: 20,
        marginRight: 16
    },
    dropdown_option_text: {
        color: COLORS.black,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
    },
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
});