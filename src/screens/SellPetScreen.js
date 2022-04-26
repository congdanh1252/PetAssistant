import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, TouchableHighlight, Alert,
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements/dist/buttons/Button";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import BottomSheet from '@gorhom/bottom-sheet';
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { 
    getSpeciesList,
    uploadMultipleImagesToStorage,
    addSellPetToFirestore
} from "../api/PetAPI";
import COLORS from '../theme/colors';
import strings from "../data/strings";
import BackButton from "../components/BackButton";
import PetSell from "../models/petSell";

const SellPetScreen = ({route, navigation}) => {
    var elseOption = '';
    var pet = new PetSell();
    const { petObj } = {
        
    };
    const { action } = route.params;
    const [photoUri, setPhotoUri] = useState(action=='add' ? [] : petObj.photo.concat(petObj.additional_photos));
    const [photoFileName, setPhotoFileName] = useState([]);
    const [name, setName] = useState(action=='add' ? '' : petObj.name);
    const [kind, setKind] = useState(action=='add' ? '' : petObj.kind);
    const [gender, setGender] = useState(action=='add' ? '' : petObj.gender);
    const [species, setSpecies] = useState(action=='add' ? '' : petObj.species);
    const [price, setPrice] = useState(action=='add' ? '' : petObj.price);
    const [discountPrice, setDiscountPrice] = useState(action=='add' ? '' : petObj.discount_price);
    const [description, setDescription] = useState(action=='add' ? '' : petObj.description);
    const [height, setHeight] = useState(action=='add' ? '' : (petObj.height + ''));
    const [weight, setWeight] = useState(action=='add' ? '' : (petObj.weight + ''));
    const [dropdown, setDropdown] = useState('');
    const [isUploading, setUploading] = useState(false);

    const [show, setShow] = useState(false);
    const [date, setDate] = useState(action=='add' ? new Date(2020, 12, 12) : petObj.age);
    const [choseDate, setChoseDate] = useState(action=='add' ? false : true);

    const snapPoints = useMemo(() => ['100%', '100%'], []);

    const [speciesOpt, setSpeciesOpt] = useState({
        dog: [],
        cat: [],
        bird: [],
        hamster: []
    });
    const [species_choice_base, setSpeciesChoiceBase] = useState([]);

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

    const handleSpeciesList = (list) => {
        setSpeciesOpt(list);
    }

    const initPetData = (urlArr) => {
        pet.name = name;
        pet.kind = kind;
        pet.gender = gender;
        pet.species = species;
        pet.photo = urlArr[0];
        pet.age = date;
        pet.additional_photos = urlArr.splice(1);
        pet.height = parseFloat(height);
        pet.weight = parseFloat(weight);
        pet.price = parseInt(price);
        pet.discount_price = parseInt(discountPrice);
        pet.description = description;
        //action === 'edit' ? pet._id = petObj._id : null;
    }

    const checkSubmitFields = () => {
        if (photoUri.length < 1 || name=='' || kind=='' || gender=='' || species==''
            || description=='' || height=='' || weight=='' || price=='') {
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

            if (action==='add') {
                uploadMultipleImagesToStorage(photoUri, photoFileName, handleImageUrl);
            }
            // else {
            //     if (photoFileName==='') {
            //         initPetData(petObj.photo);
            //         updatePetInFirestore(pet, handlePetUpdated);
            //     } else {
            //         uploadImageToStorage(photoUri, photoFileName, handleImageUrl);
            //         deleteImageFromStorage(petObj.photo);
            //     }
            // }
        }
    }

    const resetAllFields = () => {
        setPhotoUri(new Array());
        setPhotoFileName(new Array());
        setName('');
        setKind('');
        setGender('');
        setSpecies('');
        setDescription('');
        setPrice('');
        setDiscountPrice('');
        setHeight('');
        setWeight('');
        setDropdown('');
        setUploading(false);
        setShow(false);
    }

    const cancelAddingPet = () => {
        Alert.alert(
            'Cảnh báo',
            (action == 'add'
            ? 'Bạn có chắc muốn hủy đăng thông tin bán thú cưng?'
            : 'Bạn có chắc muốn hủy việc chỉnh sửa thông tin thú cưng?'),
            [
                {
                    text: strings.cancel,
                },
                {
                    text: strings.sure,
                    onPress: () => {
                        action == 'add'
                        ? resetAllFields()
                        : navigation.goBack();
                    }
                }
            ]
        );
    }

    const handleImageUrl = (urlArr) => {
        if (urlArr.length == photoUri.length) {
            console.log(urlArr)
            initPetData(urlArr);
            addSellPetToFirestore(pet, handlePetAdded);
        } else {
            console.log('Not enough download urls!');
        }
    }

    const showResultToast = (result) => {
        if (result == 'Success') {
            Toast.show({
                type: 'success',
                text1: strings.success,
                text2: action==='add' ? strings.msg_upload_sell_pet_success : strings.msg_update_sell_pet_success,
                position: 'top',
                autoHide: true,
            });

            action==='add' ? console.log('Sell pet uploaded!') : console.log('Updated sell pet!');
        }
        else {
            Toast.show({
                type: 'error',
                text1: strings.fail,
                text2: strings.msg_add_pet_fail,
                position: 'top',
                autoHide: true,
            });

            action==='add' ?
            console.log('Add to firestore error => ' + result) :
            console.log('Update to firestore error => ' + result);
        }
    }

    const handlePetAdded = (result) => {
        setUploading(false);
        showResultToast(result);

        navigation.goBack();
    }

    const updatePhotoUris = (response) => {
        let listUri = [];
        let listFilename = [];

        response.forEach(item => {
            listUri.push(item.uri);
        });

        response.forEach(item => {
            listFilename.push(item.fileName);
        });

        setPhotoUri(listUri)
        setPhotoFileName(listFilename)
    }

    const addPetPhoto = () => {
        let options = {
            selectionLimit: 0,
            mediaType: 'photo',
        }

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.errorCode == 'permission') {
                console.log(strings.err_photo_picker_permission);
            }
            else {
                updatePhotoUris(response.assets)
            }
        })
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
            default:
                addPetPhoto(value);
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
                    case 'Chim':
                        if (species_choice_base.length == 0) {
                            options = options.concat(options, speciesOpt.bird);
                        }
                        else {
                            options = options.concat(options, species_choice_base);
                        }
                        break;
                    case 'Hamster':
                        if (species_choice_base.length == 0) {
                            options = options.concat(options, speciesOpt.hamster);
                        }
                        else {
                            options = options.concat(options, species_choice_base);
                        }
                        break;
                    default:
                        options.push(strings.else_option);
                }
                break;
            default:
                options.push(strings.male, strings.female);
        }

        for (let i = 0; i < options.length; i++) {
            optionViews.push(
                <TouchableHighlight
                    key={i}
                    activeOpacity={0.7}
                    underlayColor='#EEEEEE'
                    style={
                        (options[i]==kind || options[i]==gender || options[i]==species)
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
            <BottomSheetScrollView>
                {optionViews}
            </BottomSheetScrollView>
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

    const removePhotoOnClick = (uri) => {
        let listUri = [];
        let listFilename = [];
        let removeIndex = 0;

        for (let i = 0; i < photoUri.length; i++) {
            if (photoUri[i] != uri) {
                listUri.push(photoUri[i])
            }
            if (photoUri[i] == uri) {
                removeIndex = i;
            }
        }

        for (let i = 0; i < photoFileName.length; i++) {
            if (i != removeIndex) {
                listFilename.push(photoFileName[i])
            }
        }

        setPhotoUri(listUri)
        setPhotoFileName(listFilename)
    }

    const AdditionalPhotos = () => {
        let photos = photoUri.slice(1);

        return (
            <View style={styles.additional_photos_holder}>
                {
                    photos.map((item) => {
                        return (
                            <View
                                key={item}
                                style={[styles.pet_photo,
                                    {
                                        width: '30%',
                                        marginLeft: 4,
                                        marginRight: 4,
                                        marginBottom: 6,
                                    }
                                ]}
                            >
                                <Image
                                    source={{uri: item}}
                                    style={styles.pet_photo}
                                />

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={styles.remove_photo_icon}
                                    onPress={() => {
                                        removePhotoOnClick(item)
                                    }}
                                >
                                    <Text style={{fontSize: 22, color: '#fff'}}>-</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    //get species list
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            const getSpecies = getSpeciesList(handleSpeciesList); 
        }

        return () => {
            isMounted = false;
        }
    }, [])

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton
                    container={''}
                    navigation={navigation}
                />

                <Text style={styles.header_title}>
                    {strings.sell_pet_info_label}
                </Text>
            </View>

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
                                    onPress={() => addPetPhoto()}
                                >
                                    {(photoUri.length < 1 ? 
                                        <View style={styles.plus_icon}>
                                            <Image
                                                source={require('../assets/icons/Add.png')}
                                                style={styles.plus_icon}
                                            />
                                        </View>
                                        : 
                                        <View style={styles.pet_photo}>
                                            <Image
                                                source={{uri: photoUri[0]}}
                                                style={styles.pet_photo}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Additional photos */}
                            {
                                photoUri.length > 1 ?
                                <AdditionalPhotos/>
                                : null
                            }

                            {/* Name */}
                            <View style={styles.input_holder}>
                                <Text style={styles.label}>{strings.name}</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'#898989'}
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
                                            placeholderTextColor={'#898989'}
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
                                            placeholderTextColor={'#898989'}
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
                                        placeholderTextColor={'#898989'}
                                        placeholder={strings.species}
                                        value={species}
                                    />

                                    <Image
                                        source={require('../assets/icons/ic_down.png')}
                                        style={styles.down_icon}
                                    />
                                </TouchableOpacity>
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
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.height}
                                            onChangeText={value => {
                                                setHeight(value)
                                            }}
                                            value={height}
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
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.weight}
                                            onChangeText={value => {
                                                setWeight(value)
                                            }}
                                            value={weight}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Birthday */}
                            <View style={styles.two_on_row}>
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.birthday}</Text>

                                    <TextInput
                                        editable={false}
                                        style={styles.input}
                                        placeholderTextColor={'#898989'}
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

                            {/* Price + Discount price */}
                            <View style={styles.two_on_row}>
                                {/* Price */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.og_price_label} (VNĐ)</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            keyboardType={'numeric'}
                                            textContentType={"telephoneNumber"}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.og_price_label}
                                            onChangeText={value => {
                                                setPrice(value)
                                            }}
                                            value={price}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Discount price */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.discount_price_label} (VNĐ)</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            keyboardType={'numeric'}
                                            textContentType={"telephoneNumber"}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.discount_price_label}
                                            onChangeText={value => {
                                                setDiscountPrice(value)
                                            }}
                                            value={discountPrice}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Mô tả */}
                            <View style={styles.input_holder}>
                                <Text style={styles.label}>{strings.description_label}</Text>

                                <TextInput
                                    editable={true}
                                    style={[styles.input, {height: 116}]}
                                    multiline={true}
                                    placeholderTextColor={'#898989'}
                                    placeholder={strings.sell_description_msg}
                                    value={description}
                                    onChangeText={value => {
                                        setDescription(value)
                                    }}
                                />
                            </View>

                            {/* Finish + Cancel buttons */}
                            <View style={styles.footer_buttons}>
                                <Button
                                    title={strings.cancel}
                                    titleStyle={styles.button_title}
                                    buttonStyle={styles.button}
                                    onPress={() => cancelAddingPet()}
                                >
                                </Button>

                                <Button
                                    title={strings.finist}
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

            {/* Dropdown bottomsheet */}
            {
                dropdown=='' ?
                    null
                :
                    <BottomSheet
                        index={1}
                        snapPoints={snapPoints}
                        backgroundStyle={{borderWidth: 0}}
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

            {/* Overlay */}
            {isUploading ?
                (
                    <View style={styles.overlay}>
                        <Text style={[styles.header_title, {fontSize: 24}]}>
                            {strings.processing}
                        </Text>

                        <Text style={[styles.header_title, {fontSize: 18}]}>
                            {strings.msg_please_wait}
                        </Text>
                    </View>
                ) : (null)
            }
        </View>
    )
}

export default SellPetScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        marginTop: 0,
        backgroundColor: COLORS.dark,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: 90,
        paddingLeft: 8,
        paddingTop: 16,
        flexDirection: 'row',
        backgroundColor: COLORS.dark,
    },
    header_title: {
        width: '74%',
        fontSize: 22,
        marginTop: 16,
        fontFamily: 'Roboto-Medium',
        color: COLORS.white,
        textAlign: 'center',
    },
    content: {
        height: '100%',
        width: '100%',
        paddingLeft: 22,
        paddingRight: 22,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
        opacity: 0.8,
        marginBottom: 10,
    },
    pet_photo_holder: {
        width: '38%',
        height: 160,
        marginTop: 12,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photo_picker: {
        width: '100%',
        height: 120,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.grey,
    },
    pet_photo: {
        width: '100%',
        height: 120,
        borderRadius: 15,
    },
    plus_icon: {
        width: 50,
        height: 50,
    },
    remove_photo_icon: {
        position: 'absolute',
        right: -6,
        top: -6,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black
    },
    additional_photos_holder: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        marginTop: 40,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdown_bottomsheet: {
        borderRadius: 10,
    },
    dropdown_option: {
        width: '99%',
        height: 60,
        padding: 12,
        alignSelf: 'center',
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