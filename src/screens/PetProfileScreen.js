import React, { useMemo, useRef, useState, useEffect } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import Toast from "react-native-toast-message";
import Dialog from "react-native-dialog";
import { ProgressCircle } from 'react-native-svg-charts';
import {
    Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, LogBox,
    TouchableHighlight, TouchableWithoutFeedback, Switch
} from 'react-native';
import { deletePetFromFirestore } from '../api/PetAPI';
import { windowWidth } from '../models/common/Dimensions';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import Pet from '../models/pet';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const PetProfileScreen = ({route, navigation}) => {
    const [pet, setPet] = useState(new Pet());
    const [petAge, setPetAge] = useState('');
    const [setting, setSetting] = useState('');
    const [deleteName, setDeleteName] = useState('');
    const [unmatchInput, setUnmatchInput] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['40%', '78%'], []);
    const snapPointsDropdown = useMemo(() => ['20%', '20%'], []);

    const { pet_id } = route.params;
    
    var care_section = [
        {
            task: 'Shower',
            activated: true,
            due_date: new Date()
        },
        {
            task: 'Shopping',
            activated: false,
            due_date: new Date()
        },
        {
            task: 'Vaccination',
            activated: true,
            due_date: new Date()
        },
        {
            task: 'Walking',
            activated: false,
            due_date: new Date()
        },
        {
            task: 'Cleaning',
            activated: true,
            due_date: new Date()
        }
    ];

    const showResultToast = (result) => {
        if (result === 'Success') {
            Toast.show({
                type: 'success',
                text1: strings.success,
                text2: strings.msg_delete_pet_success,
                position: 'top',
                autoHide: true,
            });

            console.log('Pet deleted!');
        }
        else {
            Toast.show({
                type: 'error',
                text1: strings.fail,
                text2: strings.msg_delete_pet_fail,
                position: 'top',
                autoHide: true,
            });

            console.log('Delete from firestore error => ' + e);
        }
    }

    const handlePetDeleted = (result) => {
        showResultToast(result);

        navigation.goBack();
    }

    const handleDeleteButton = () => {
        if (deleteName===pet.name) {
            deletePetFromFirestore(pet._id, pet.photo, handlePetDeleted);
        } else {
            setUnmatchInput(true);
        }
    }

    const handleEditButton = () => {
        navigation.navigate('AddPet', {
            action: 'edit',
            petObj: pet,
        })
    }

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

    //Care boxes
    const CareContent = () => {
        var boxes = [];
        var icon;
        for (let i = 0; i < care_section.length; i++) {
            switch (care_section[i].task) {
                case 'Shower':
                    icon = require('../assets/icons/ic_shampoo.png')
                    break;
                case 'Shopping':
                    icon = require('../assets/icons/ic_shop.png')
                    break;
                case 'Vaccination':
                    icon = require('../assets/icons/ic_vaccination.png')
                    break;
                case 'Walking':
                    icon = require('../assets/icons/ic_leash.png')
                    break;
                default:
                    icon = require('../assets/icons/ic_scoop.png')
            }

            boxes.push(
                <View style={style.care_box} key={i}>
                    <ProgressCircle
                        style={{height: 115}}
                        progress={0.5}
                        startAngle={-Math.PI * 0.8}
                        endAngle={Math.PI * 0.8}
                        progressColor={COLORS.pet_green}
                    />

                    <View style={style.care_uppers_chart}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                        >
                            <Image
                                style={[
                                    style.pet_gender,
                                    {
                                        marginLeft: 0,
                                        marginBottom: 4,
                                        width: 50,
                                        height: 50,
                                    }
                                ]}
                                source={icon}
                            />
                        </TouchableOpacity>

                        <Switch
                            thumbColor={"#f4f3f4"}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            ios_backgroundColor="#3e3e3e"
                            value={care_section[i].activated}
                        />
                    </View>
                </View>
            )
        }

        return (
            <View style={style.care_content}>
                {boxes}
            </View>
        )
    }

    const calculateAge = (num) => {
        var bornDays = Math.abs(new Date() - num) / 86400000;
        var age = Math.round(bornDays / 365);
        var ageWithoutRound = (bornDays / 365) - age;
        if (ageWithoutRound === 0) {
            setPetAge(age);
        } else {
            setPetAge('<' + age);
        }
    }

    //get pet data
    useEffect(() => {
        const subscriber = firestore()
        .collection('users/' + auth().currentUser.uid + '/pets')
        .doc(pet_id)
        .onSnapshot(documentSnapshot => {
            var newPet = new Pet();
            newPet.update(documentSnapshot.data());
            newPet.birthday = new Date(documentSnapshot.data().dob.toDate());
            newPet._id = documentSnapshot.id;
            calculateAge(newPet.birthday);
            setPet(newPet);
        })

        return () => subscriber();
    }, [])
    
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
                {
                    pet.photo!='' ? 
                        <Image
                            style={style.pet_photos}
                            source={{uri: pet.photo}}
                        />
                    :
                        (null)
                }

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

                {/* Care */}
                <View style={style.care_information}>
                    <Text style={style.section_title}>
                        {strings.care_title}
                    </Text>

                    <CareContent/>
                </View>

                {/* Health book */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={style.health_book_holder}
                    onPress={() => {
                        navigation.navigate('HealthBook', {
                            pet_id: pet._id,
                            pet_kind: pet.kind
                        })
                    }}
                >
                    <Text
                        style={
                            [style.section_title, {marginBottom: 0}]
                        }
                    >
                        {strings.health_book}
                    </Text>

                    <Image
                        style={{height: 36, width: 36}}
                        source={require('../assets/icons/ic_health_book.png')}
                    />
                </TouchableOpacity>
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
                                            handleEditButton();
                                            setSetting('');
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

            {/* Delete pet dialog */}
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title
                    style={{fontFamily: 'Roboto-Bold', color: COLORS.black}}
                >
                    {strings.delete_pet}
                </Dialog.Title>

                <Dialog.Description style={{color: COLORS.black}}>
                    {strings.delete_pet_msg}
                </Dialog.Description>

                <Dialog.Input
                    style={
                        unmatchInput ? [style.input, {color: '#ed134a'}] : style.input
                    }
                    underlineColorAndroid={'transparent'}
                    placeholder={strings.enterPetName}
                    value={deleteName}
                    onChangeText={(value) => {
                        setDeleteName(value)
                        setUnmatchInput(false)
                    }}
                />

                {/* Cancel */}
                <Dialog.Button
                    color={COLORS.black}
                    label={strings.cancel}
                    onPress={() => {
                        setDialogVisible(false);
                    }}
                />

                {/* Sure */}
                <Dialog.Button
                    color={COLORS.black}
                    label={strings.sure}
                    onPress={() => {
                        handleDeleteButton();
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
        height: '63%',
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
        marginTop: 16,
    },
    health_book_holder: {
        marginTop: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    care_content: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    care_box: {
        width: windowWidth / 4,
        margin: 4,
    },
    care_uppers_chart: {
        width: 98,
        height: 98,
        left: 5,
        top: 12,
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    input: {
        width: '96%',
        height: 46,
        fontSize: 16,
        color:COLORS.black,
        paddingLeft: 12,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: COLORS.grey,
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