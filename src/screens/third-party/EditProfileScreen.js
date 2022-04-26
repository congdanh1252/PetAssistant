import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, TouchableHighlight, Alert,
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements/dist/buttons/Button";
import { launchImageLibrary } from "react-native-image-picker";
import Dialog from "react-native-dialog";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Toast from "react-native-toast-message";

import COLORS from '../../theme/colors';
import strings from "../../data/strings";
import BackButton from "../../components/BackButton";
import thirdParty from "../../models/thirdParty";

const EditProfileScreen = ({route, navigation}) => {
    var tp = new thirdParty();
    const list = [
        {
            detail: 'Tiêm ngừa',
            price: '50000',
            description: 'zzzzzz'
        },
        {
            detail: 'Tẩy giun',
            price: '50000',
            description: 'Các ca phẫu thuật chỉnh hình liên quan đến mổ xương chó mèo, ghép xương chó mèo, bó xương chó mèo từ đơn giản đến phức tạp nhất Các ca phẫu thuật chỉnh hình liên quan đến mổ xương chó mèo, ghép xương chó mèo, bó xương chó mèo từ đơn giản đến phức tạp nhất'
        }
    ];

    const mergePhotos = (thumbnail, photoArr) => {
        let newArr = new Array();
        newArr.push(thumbnail);
        photoArr.forEach(element => {
            newArr.push(element)
        });

        return newArr;
    }

    const { action, paramObj } = route.params;
    const [photoUri, setPhotoUri] = useState(action=='add' ? [] : mergePhotos(paramObj.thumbnail, paramObj.img));
    const [photoFileName, setPhotoFileName] = useState([]);
    const [name, setName] = useState(action=='add' ? '' : paramObj.name);
    const [address, setAddress] = useState(action=='add' ? '' : paramObj.address);
    const [category, setCategory] = useState(action=='add' ? '' : paramObj.category);
    const [phone_number, setPhoneNumber] = useState(action=='add' ? '' : paramObj.phone_number);
    const [services, setServices] = useState(action=='add' ? [] : paramObj.services);
    const [dropdown, setDropdown] = useState('');
    const [itemAction, setItemAction] = useState('');
    const [dialogShow, setDialogShow] = useState(false);
    const [dialogAction, setDialogAction] = useState('');
    const [expand, setExpand] = useState([0,0,0,0,0,0,0,0]);
    const [dialogItemName, setDialogItemName] = useState('');
    const [dialogItemDescription, setDialogItemDescription] = useState('');
    const [dialogItemPrice, setDialogItemPrice] = useState(0);
    const [isUploading, setUploading] = useState(false);

    const snapPoints = useMemo(() => ['27%', '27%'], []);

    const getExpandStatus = (arr) => {
        expand.forEach(element => {
            arr.push(element);
        });
    }

    const initThirdPartyData = (urlArr) => {
        // pet.name = name;
        // pet.kind = kind;
        // pet.gender = gender;
        // pet.species = species;
        // pet.photo = urlArr[0];
        // pet.age = date;
        // pet.additional_photos = urlArr.splice(1);
        // pet.height = parseFloat(height);
        // pet.weight = parseFloat(weight);
        // pet.price = parseInt(price);
        // pet.discount_price = parseInt(discountPrice);
        // pet.description = description;
        //action === 'edit' ? pet._id = petObj._id : null;
    }

    const checkSubmitFields = () => {
        if (photoUri.length < 1 || name=='' || address=='' || category=='' || phone_number==''
            || services.length < 1) {
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
                //uploadMultipleImagesToStorage(photoUri, photoFileName, handleImageUrl);
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
        setAddress('');
        setCategory('');
        setPhoneNumber('');
        setServices([]);
        setDropdown('');
        setUploading(false);
        setShow(false);
    }

    const cancelAddingItem = () => {
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
            initThirdPartyData(urlArr);
            //addSellPetToFirestore(pet, handlePetAdded);
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

    const handleItemAdded = (result) => {
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

    const addItemPhoto = () => {
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
            case 'Category':
                setCategory(value);
                break;
            default:
                addItemPhoto(value);
        }

        setDropdown('');
    }

    const DropDownOptions = () => {
        var options = [];
        var optionViews = [];

        options.push(strings.clinic_label, strings.spa_label, strings.pet_sitter_label);

        for (let i = 0; i < options.length; i++) {
            optionViews.push(
                <TouchableHighlight
                    key={i}
                    activeOpacity={0.7}
                    underlayColor='#EEEEEE'
                    style={
                        (options[i]==category)
                        ?
                        [styles.dropdown_option, {backgroundColor: COLORS.grey}] : styles.dropdown_option
                    }
                    onPress={() => 
                        setValueFromDropdown(options[i])
                    }
                >
                    <View style={styles.else_option}>
                        <Text style={styles.dropdown_option_text}>
                            {options[i]}
                        </Text>
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

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton
                    container={''}
                    navigation={navigation}
                />

                <Text style={styles.header_title}>
                    {strings.edit}
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
                                    onPress={() => addItemPhoto()}
                                >
                                    {(photoUri.length < 1 ? 
                                        <View style={styles.plus_icon}>
                                            <Image
                                                source={require('../../assets/icons/Add.png')}
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

                            {/* Address */}
                            <View style={styles.input_holder}>
                                <Text style={styles.label}>{strings.address_label}</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'#898989'}
                                    placeholder={strings.address_label}
                                    value={address}
                                    onChangeText={value => {
                                        setAddress(value)
                                    }}
                                />
                            </View>

                            {/* Category + Phone number */}
                            <View style={styles.two_on_row}>
                                {/* Category */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.category_label}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setDropdown('Category')}
                                    >
                                        <TextInput
                                            editable={false}
                                            style={styles.input}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.category_label}
                                            value={category}
                                        />

                                        <Image
                                            source={require('../../assets/icons/ic_down.png')}
                                            style={styles.down_icon}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Phone number */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.phone}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setDropdown('Gender')}
                                    >
                                        <TextInput
                                            editable={true}
                                            style={styles.input}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.phone}
                                            value={phone_number}
                                            onChangeText={(value) => {
                                                setPhoneNumber(value)
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Services */}
                            <View style={styles.input_holder}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={styles.label}>{strings.service_label}</Text>

                                    {/* Add icon */}
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{marginBottom: 6, marginLeft: 16}}
                                        onPress={() => {
                                            setDialogAction('add')
                                            setDialogShow(true)
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30
                                            }}
                                            source={require('../../assets/icons/Add.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                
                                {
                                    list.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={item.detail}
                                                style={{marginTop: 4, marginBottom: 4}}
                                                activeOpacity={0.7}
                                                onPress={() => {
                                                    let arr = [];
                                                    getExpandStatus(arr);
                                                    arr[index] = 1 - arr[index];

                                                    setExpand(arr);
                                                }}
                                            >
                                                <View
                                                    style={
                                                        expand[index]==0 ?
                                                        [styles.input, {height: 50}]
                                                        : [styles.input, { height: 122 }]
                                                    }
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between'
                                                        }}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.dropdown_option_text,
                                                                {fontWeight: 'bold'}
                                                            ]}
                                                        >
                                                            {item.detail} - {item.price} VNĐ
                                                        </Text>

                                                        <TouchableOpacity
                                                            activeOpacity={0.7}
                                                            style={styles.edit_item_icon}
                                                            onPress={() => {
                                                                setDialogShow(true)
                                                                setDialogAction('edit')
                                                                setDialogItemName(item.detail)
                                                                setDialogItemDescription(item.description)
                                                                setDialogItemPrice(parseInt(item.price))
                                                            }}
                                                        >
                                                            <Image
                                                                style={styles.edit_icon}
                                                                source={require('../../assets/icons/ic_edit.png')}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>

                                                    {/* description */}
                                                    {
                                                        expand[index] == 1 ?
                                                        (
                                                            <Text
                                                                style={[styles.dropdown_option_text, {marginTop: 6}]}
                                                                numberOfLines={3}
                                                            >
                                                                {item.description}
                                                            </Text>
                                                        )
                                                        : null
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>

                            {/* Finish + Cancel buttons */}
                            <View style={styles.footer_buttons}>
                                <Button
                                    title={strings.cancel}
                                    titleStyle={styles.button_title}
                                    buttonStyle={styles.button}
                                    onPress={() => cancelAddingItem()}
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

                        {
                            dialogShow ?
                            <Dialog.Container
                                visible={true}
                                contentStyle={{
                                    maxWidth: '64%'
                                }}
                            >
                                <Dialog.Title
                                    style={{
                                        fontSize: 18,
                                        fontFamily: 'Roboto-Bold',
                                    }}
                                >
                                    {dialogAction=='add' ? 'Thêm dịch vụ' : 'Chỉnh sửa'}
                                </Dialog.Title>

                                {/* Tên dịch vụ */}
                                <View style={styles.input_holder}>
                                    <Text style={styles.label}>Tên dịch vụ</Text>

                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor={'#898989'}
                                        placeholder={strings.name}
                                        value={dialogItemName}
                                        onChangeText={value => {
                                            setDialogItemName(value)
                                        }}
                                    />
                                </View>

                                {/* Mô tả */}
                                <View style={styles.input_holder}>
                                    <Text style={styles.label}>{strings.description_label}</Text>

                                    <TextInput
                                        style={[styles.input, {height: 122}]}
                                        placeholderTextColor={'#898989'}
                                        placeholder={strings.description_label}
                                        value={dialogItemDescription}
                                        multiline={true}
                                        onChangeText={value => {
                                            setDialogItemDescription(value)
                                        }}
                                    />
                                </View>

                                {/* Giá tiền */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View style={[styles.input_holder, {width: '70%'}]}>
                                        <Text style={styles.label}>Giá tiền</Text>

                                        <TextInput
                                            style={styles.input}
                                            placeholderTextColor={'#898989'}
                                            placeholder={'Giá tiền'}
                                            value={dialogItemPrice.toString()}
                                            keyboardType={'numeric'}
                                            onChangeText={value => {
                                                setDialogItemPrice(parseInt(value))
                                            }}
                                        />
                                    </View>

                                    <Text
                                        style={{
                                            marginTop: 52,
                                            color: COLORS.black,
                                            fontSize: 16
                                        }}
                                    >
                                        VNĐ
                                    </Text>
                                </View>

                                <Dialog.Button
                                    style={{color: COLORS.black, marginTop: 8}}
                                    label={strings.cancel}
                                    onPress={() => {
                                        setDialogShow(false)
                                    }}
                                />

                                {
                                    dialogAction=='edit' ?
                                    <Dialog.Button
                                        style={{color: COLORS.black, marginTop: 8, marginLeft: 8}}
                                        label={strings.delete}
                                        onPress={() => {
                                            
                                        }}
                                    /> : null
                                }

                                <Dialog.Button
                                    style={{color: COLORS.black, marginTop: 8, marginLeft: 8}}
                                    label={'OK'}
                                    onPress={() => {
                                        
                                    }}
                                />                      
                            </Dialog.Container>
                            : null
                        }
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>

            {/* Dropdown bottomsheet */}
            {
                dropdown=='' ?
                    null
                :
                <TouchableWithoutFeedback onPress={() => {setDropdown('')}}>
                    <View style={styles.overlay}>
                        <BottomSheet
                            index={1}
                            snapPoints={snapPoints}
                            backgroundStyle={{borderWidth: 0}}
                            style={styles.dropdown_bottomsheet}
                            enableOverDrag={false}
                            enablePanDownToClose={true}
                            onClose={() => setDropdown('')}
                        >
                            <DropDownOptions/>
                        </BottomSheet>
                    </View>
                </TouchableWithoutFeedback>
            }

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

export default EditProfileScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.white
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
    down_icon_service: {
        width: 26,
        height: 26,
        transform: [{
            rotateZ: '-90deg',
        }],
        tintColor: COLORS.black
    },
    edit_item_icon: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black
    },
    edit_icon: {
        tintColor: '#fff',
        width: 18,
        height: 18
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