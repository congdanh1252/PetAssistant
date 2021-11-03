import React, { useMemo, useState } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, TouchableHighlight, Alert
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements/dist/buttons/Button";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import BottomSheet from '@gorhom/bottom-sheet';
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import {
    uploadImageToStorage,
    addPetToFirestore
} from '../api/PetAPI';

import COLORS from '../theme/colors';
import strings from "../data/strings";
import BackButton from "../components/BackButton";
import Pet from "../models/pet";

const AddPetScreen = () => {
    var elseOption = '';
    const [photoUri, setPhotoUri] = useState('');
    const [photoFileName, setPhotoFileName] = useState('');
    const [name, setName] = useState('');
    const [kind, setKind] = useState('');
    const [gender, setGender] = useState('');
    const [species, setSpecies] = useState('');
    //const [birthday, setBirthday] = useState('');
    const [breed, setBreed] = useState('');
    const [status, setStatus] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [dropdown, setDropdown] = useState('');
    const [isUploading, setUploading] = useState(false);

    const [date, setDate] = useState(new Date(2017, 12, 12));
    const [show, setShow] = useState(false);
    const [choseDate, setChoseDate] = useState(false);

    const snapPoints = useMemo(() => ['100%', '100%'], []);

    const speciesOpt = {
        dog: [
            'Husky Bắc Cực',
            'Husky Nam Cực',
            'Husky Alaska',
            'Husky Tây Tạng'
        ],
        cat: [
            'Munchkin',
            'Xiêm',
            'Bengal',
            'Anh lông ngắn'
        ],
    };
    const [species_choice_base, setSpeciesChoiceBase] = useState([]);

    const checkSubmitFields = () => {
        if (photoUri=='' || name=='' || kind=='' || gender=='' || species==''
            || !choseDate || breed=='' || status=='' || height=='' || weight=='') {
            Alert.alert(
                strings.fail,
                strings.err_check_inputs,
                [
                    {
                        text: 'OK',
                    }
                ]
            );
        }
        else {
            console.log('check input ok');
            setUploading(true);

            uploadImageToStorage(photoUri, photoFileName, handleImageUrl);
        }
    }

    const resetAllFields = () => {
        setPhotoUri('');
        setPhotoFileName('');
        setName('');
        setKind('');
        setGender('');
        setSpecies('');
        setBreed('');
        setStatus('');
        setHeight('');
        setWeight('');
        setDropdown('');
        setUploading(false);
        setDate(new Date('2017, 12, 12'));
        setShow(false);
        setChoseDate(false);
    }

    const cancelAddingPet = () => {
        Alert.alert(
            'Cảnh báo',
            'Bạn có chắc muốn hủy việc thêm thông tin thú cưng?',
            [
                {
                    text: strings.cancel,
                },
                {
                    text: strings.sure,
                    onPress: () => {
                        resetAllFields();
                    }
                }
            ]
        );
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);

        var today = new Date();

        if (selectedDate!=null && currentDate < today) {
            setDate(currentDate);
            setChoseDate(true);
            console.log(selectedDate);
        }
        else {
            console.log("INVALID DATE");
        }
    };

    const handleImageUrl = (url) => {
        var pet = new Pet();
        pet.name = name;
        pet.kind = kind;
        pet.gender = gender;
        pet.species = species;
        pet.photo = url;
        pet.height = parseFloat(height);
        pet.weight = parseFloat(weight);
        pet.birthday = date;
        pet.status = status;
        pet.breed = breed;
        addPetToFirestore(pet, handlePetAdded);
    }

    const handlePetAdded = (result) => {
        setUploading(false);
        if (result == 'Success') {
            Toast.show({
                type: 'success',
                text1: strings.success,
                text2: strings.msg_add_pet_success,
                position: 'top',
                autoHide: true,
            });

            console.log('Pet added!');
        }
        else {
            Toast.show({
                type: 'error',
                text1: strings.fail,
                text2: strings.msg_add_pet_success,
                position: 'top',
                autoHide: true,
            });

            console.log('Add to firestore error => ' + e);
        }
    }

    const addPetPhoto = (method) => {
        console.log(method);
        let options = {
            selectionLimit: 1,
            mediaType: 'photo',
        }

        if (method==strings.pick_photo_fr_lib) {
            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.errorCode == 'permission') {
                    console.log(strings.err_photo_picker_permission);
                }
                else {
                    setPhotoUri(response.assets[0].uri);
                    setPhotoFileName(response.assets[0].fileName);
                    console.log(response.assets[0].fileName);
                }
            })
        }
        else {
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.errorCode == 'permission') {
                    console.log(strings.err_photo_picker_permission);
                }
                else {
                    setPhotoUri(response.assets[0].uri);
                    setPhotoFileName(response.assets[0].fileName);
                    console.log(response.assets[0].fileName);
                }
            })
        }
    }

    const setValueFromDropdown = (value) => {
        switch (dropdown) {
            case 'Kind':
                setKind(value);
                setSpeciesChoiceBase([]);
                if (kind != value) setSpecies('');
                break;
            case 'Gender':
                setGender(value);
                break;
            case 'Species':
                setSpecies(value);
                break;
            case 'Breed':
                setBreed(value);
                break;
            case 'AddPhoto':
                addPetPhoto(value);
                break;
            default:
                setStatus(value);
        }

        setDropdown('');
    }

    const DropDownOptions = () => {
        var options = [];
        var optionViews = [];

        switch (dropdown) {
            case 'Kind':
                options.push(strings.dog, strings.cat, strings.bird, strings.snake, 'Hamster', strings.else_option);
                break;
            case 'Gender':
                options.push(strings.male, strings.female);
                break;
            case 'Species':
                switch (kind) {
                    case 'Chó':
                        if (species_choice_base.length == 0) {
                            options = options.concat(options, speciesOpt.dog);
                        }
                        else {
                            options = options.concat(options, species_choice_base);
                        }
                        break;
                    case 'Mèo':
                        if (species_choice_base.length == 0) {
                            options = options.concat(options, speciesOpt.cat);
                        }
                        else {
                            options = options.concat(options, species_choice_base);
                        }
                        break;
                    default:
                        options.push(strings.else_option);
                }
                break;
            case 'Breed':
                options.push(strings.purebred, strings.mixed_breed, strings.unknown);
                break;
            case 'Status':
                options.push(strings.sts_healthy, strings.sts_sick);
                break;
            default:
                options.push(strings.take_photo, strings.pick_photo_fr_lib);
        }

        for (let i = 0; i < options.length; i++) {
            optionViews.push(
                <TouchableHighlight
                    key={i}
                    activeOpacity={0.7}
                    underlayColor='#EEEEEE'
                    style={
                        (options[i]==kind || options[i]==breed || options[i]==gender || options[i]==status)
                        ?
                        [styles.dropdown_option, {backgroundColor: COLORS.grey}] : styles.dropdown_option
                    }
                    onPress={() => 
                        options[i]!=strings.else_option
                        ? setValueFromDropdown(options[i]) : (null)
                    }
                >
                    <View style={styles.else_option}>
                        <Text style={styles.dropdown_option_text}>
                            {options[i]}
                        </Text>

                        {
                            options[i]==strings.else_option ? 
                            (
                                <TextInput
                                    editable={true}
                                    style={[styles.input, {width: '60%', height: 44}]}
                                    placeholder={strings.type_value}
                                    onChangeText={value => {
                                        elseOption = value;
                                    }}
                                    onSubmitEditing={() => setValueFromDropdown(elseOption)}
                                />
                            ) : (null)
                        }
                    </View>
                </TouchableHighlight>
            )
        }

        return (
            <View>
                {optionViews}
            </View>
        )
    }
    
    function sortDropdownBasedOnSearch(criterias) {
        var map = [];
        var dataArr = [];
        switch (kind) {
            case 'Chó':
                dataArr = dataArr.concat(speciesOpt.dog, dataArr);
                break;
            case 'Mèo':
                dataArr = dataArr.concat(speciesOpt.cat, dataArr);
                break;
            default:

        }

        for (let i = 0; i < dataArr.length;  i++) {
            if (dataArr[i].toLowerCase().includes(criterias.toLowerCase())) {
                map.push(dataArr[i]);
            }
        }
        setSpeciesChoiceBase(map);
    }

    return (
        <View>
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                enableAutomaticScroll={true}
                scrollEnabled={true}
                onScroll={() => Keyboard.dismiss()}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss()
                        setDropdown('');
                    }}
                >
                    <View style={styles.container}>
                        {/* Content */}
                        <View style={styles.content}>
                            {/* Photo */}
                            <View style={styles.pet_photo_holder}>
                                <Text style={styles.label}>
                                    {strings.photo}
                                </Text>

                                <TouchableOpacity
                                    style={styles.photo_picker}
                                    activeOpacity={0.7}
                                    onPress={() => setDropdown('AddPhoto')}
                                >
                                    {(photoUri=='' ? 
                                        <View style={styles.plus_icon}>
                                            <Image
                                                source={require('../assets/icons/Add.png')}
                                                style={styles.plus_icon}
                                            />
                                        </View>
                                        : 
                                        <View style={styles.pet_photo}>
                                            <Image
                                                source={{uri: photoUri}}
                                                style={styles.pet_photo}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Name */}
                            <View style={styles.input_holder}>
                                <Text style={styles.label}>{strings.name}</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder={strings.name}
                                    value={name}
                                    onChangeText={value => {
                                        setName(value)
                                    }}
                                />
                            </View>

                            {/* Kind + Gender */}
                            <View style={styles.two_on_row}>
                                {/* Kind */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.kind}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setDropdown('Kind')}
                                    >
                                        <TextInput
                                            editable={false}
                                            style={styles.input}
                                            placeholder={strings.kind}
                                            value={kind}
                                        />

                                        <Image
                                            source={require('../assets/icons/ic_down.png')}
                                            style={styles.down_icon}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Gender */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.gender}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setDropdown('Gender')}
                                    >
                                        <TextInput
                                            editable={false}
                                            style={styles.input}
                                            placeholder={strings.gender}
                                            value={gender}
                                        />

                                        <Image
                                            source={require('../assets/icons/ic_down.png')}
                                            style={styles.down_icon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Species */}
                            <View style={styles.input_holder}>
                                <Text style={styles.label}>{strings.species}</Text>
                                
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setDropdown('Species')}
                                >
                                    <TextInput
                                        editable={false}
                                        style={styles.input}
                                        placeholder={strings.species}
                                        value={species}
                                    />

                                    <Image
                                        source={require('../assets/icons/ic_down.png')}
                                        style={styles.down_icon}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Birthday */}
                            <View style={styles.two_on_row}>
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.birthday}</Text>

                                    <TextInput
                                        editable={false}
                                        style={styles.input}
                                        placeholder={strings.birthday}
                                        value={
                                            choseDate
                                            ?
                                            (
                                                String(date.getDate()).padStart(2, '0') + "-" +
                                                String(date.getMonth() + 1).padStart(2, '0') + "-" +
                                                date.getFullYear()
                                            ) : (null)
                                        }
                                    />
                                </View>

                                {/* Calendar icon */}
                                <View style={[styles.input_holder_small, {alignItems: 'center'}]}>
                                    <TouchableOpacity
                                        style={{width: '36%', alignItems: 'center', marginTop: 40,}}
                                        activeOpacity={0.6}
                                        onPress={() => setShow(true)}
                                    >
                                        <Image
                                            source={require('../assets/icons/ic_calendar.png')}
                                            style={styles.plus_icon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Breed + Status */}
                            <View style={styles.two_on_row}>
                                {/* Breed */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.breed}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setDropdown('Breed')}
                                    >
                                        <TextInput
                                            editable={false}
                                            style={styles.input}
                                            placeholder={strings.breed}
                                            value={breed}
                                        />

                                        <Image
                                            source={require('../assets/icons/ic_down.png')}
                                            style={styles.down_icon}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Status */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.status}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setDropdown('Status')}
                                    >
                                        <TextInput
                                            editable={false}
                                            style={styles.input}
                                            placeholder={strings.status}
                                            value={status}
                                        />

                                        <Image
                                            source={require('../assets/icons/ic_down.png')}
                                            style={styles.down_icon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Height + Weight */}
                            <View style={styles.two_on_row}>
                                {/* Height */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.height} (cm)</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            keyboardType={'numeric'}
                                            textContentType={"telephoneNumber"}
                                            placeholder={strings.height}
                                            onChangeText={value => {
                                                setHeight(value)
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Weight */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.weight} (kg)</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            keyboardType={'numeric'}
                                            textContentType={"telephoneNumber"}
                                            placeholder={strings.weight}
                                            onChangeText={value => {
                                                setWeight(value)
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Save + Cancel buttons */}
                            <View style={styles.footer_buttons}>
                                <Button
                                    title={strings.cancel}
                                    titleStyle={styles.button_title}
                                    buttonStyle={styles.button}
                                    onPress={() => cancelAddingPet()}
                                >
                                </Button>

                                <Button
                                    title={strings.save}
                                    titleStyle={styles.button_title}
                                    buttonStyle={styles.button}
                                    onPress={() => checkSubmitFields()}
                                >
                                </Button>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>

            {/* Header */}
            <View style={styles.header}>
                <BackButton container={''}/>

                <Text style={styles.header_title}>
                    {strings.add_pet}
                </Text>
            </View>

            {/* Dropdown bottomsheet */}
            {
                dropdown=='' ?
                    null
                :
                    <BottomSheet
                        index={1}
                        snapPoints={snapPoints}
                        backgroundStyle={{borderWidth: 1}}
                        style={styles.dropdown_bottomsheet}
                        enableOverDrag={false}
                        enablePanDownToClose={true}
                        onClose={() => setDropdown('')}
                    >
                        {
                            dropdown=='Species' ?
                            (
                                <TextInput
                                    editable={true}
                                    style={[
                                        styles.input,
                                        {width: '95%', height: 44, alignSelf: "center", marginBottom: 12}
                                    ]}
                                    placeholder={strings.find}
                                    onChangeText={(value) => {
                                        sortDropdownBasedOnSearch(value);
                                    }}
                                />
                            ) : (null)
                        }
                        <DropDownOptions/>
                    </BottomSheet>
            }
            
            {/* Date Picker */}
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    is24Hour={true}
                    display="spinner"
                    dateFormat="day month year"
                    onChange={onChangeDate}
                />
            )}

            {isUploading ?
                (
                    <View style={styles.overlay}>
                        <Text style={[styles.header_title, {fontSize: 24}]}>
                            {strings.loading}
                        </Text>

                        <Text style={[styles.header_title, {fontSize: 18}]}>
                            {strings.msg_please_wait}
                        </Text>
                    </View>
                ) : (null)
            }

            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
    )
}

export default AddPetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        position: 'relative',
    },
    header: {
        width: '100%',
        height: 62,
        paddingLeft: 8,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.black,
    },
    header_title: {
        width: '72%',
        fontSize: 20,
        fontFamily: 'Roboto-Medium',
        color: COLORS.white,
        textAlign: 'center',
    },
    content: {
        height: '100%',
        width: '100%',
        marginTop: 62,
        paddingLeft: 22,
        paddingRight: 22,
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
        opacity: 0.7,
        marginBottom: 10,
    },
    pet_photo_holder: {
        width: '40%',
        height: 180,
        marginTop: 12,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photo_picker: {
        width: '100%',
        height: 140,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.grey,
    },
    pet_photo: {
        width: '100%',
        height: 140,
        borderRadius: 15,
    },
    plus_icon: {
        width: 50,
        height: 50,
    },
    input_holder: {
        width: '100%',
        marginTop: 22,
    },
    input_holder_small: {
        width: '45%',
        marginTop: 16,
    },
    input: {
        width: '100%',
        height: 46,
        fontSize: 16,
        backgroundColor: '#EEEEEE',
        color:COLORS.black,
        padding: 12,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    two_on_row: {
        width: '100%',
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    down_icon: {
        width: 16,
        height: 16,
        position: 'absolute',
        right: 10,
        top: 14,
        tintColor: COLORS.black,
    },
    button: {
        width: 120,
        height: 40,
        borderRadius: 12,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: COLORS.black,
    },
    button_title: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: COLORS.white,
    },
    footer_buttons: {
        width: '100%',
        height: 40,
        marginTop: 70,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    dropdown_option_text: {
        color: COLORS.black,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
    },
    else_option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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