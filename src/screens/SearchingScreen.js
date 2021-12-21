import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity,
    TouchableWithoutFeedback, TouchableHighlight, ActivityIndicator
} from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';
import { launchImageLibrary, launchCamera } from "react-native-image-picker";

const SearchingScreen = ({route, navigation}) => {
    const [photoUri, setPhotoUri] = useState('');
    const [photoFileName, setPhotoFileName] = useState('');
    const [dropdown, setDropdown] = useState('');

    const snapPoints = useMemo(() => ['19%', '19%'], []);

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

        setDropdown('');
    }

    const DropdownOptions = () => {
        var optionView = [];
        var options = [strings.take_photo, strings.pick_photo_fr_lib];

        for (let i = 0; i < 2; i++) {
            optionView.push(
                <TouchableHighlight
                    key={i}
                    activeOpacity={0.7}
                    underlayColor='#EEEEEE'
                    style={style.dropdown_option}
                    onPress={() => {
                        i == 0 ? addPetPhoto('') : addPetPhoto(strings.pick_photo_fr_lib)
                    }}
                >
                    <Text style={style.dropdown_option_text}>
                        {options[i]}
                    </Text>
                </TouchableHighlight>
            )
        }

        return (
            <View>
                {optionView}
            </View>
        )
    }

    const Results = () => {
        var res = [];

        return (
            <ScrollView
                style={style.guide_list_container}
                showsVerticalScrollIndicator={false}
            >
                {
                    photoUri == '' ?
                    <Text style={style.msg}>{strings.msg_choose_photo_to_search}</Text> :
                    res
                }
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

                <Text style={style.headerTitle}>{strings.findInfomation}</Text>
            </View>

            <View style={style.container}>
                <View style={style.pet_photo_holder}>
                    <Text style={style.label}>
                        {strings.photo}
                    </Text>

                    <TouchableOpacity
                        style={style.photo_picker}
                        activeOpacity={0.7}
                        onPress={() => setDropdown('AddPhoto')}
                    >
                        {(photoUri=='' ? 
                            <View style={style.plus_icon}>
                                <Image
                                    source={require('../assets/icons/Add.png')}
                                    style={style.plus_icon}
                                />
                            </View>
                            : 
                            <View style={style.pet_photo}>
                                <Image
                                    source={{uri: photoUri}}
                                    style={style.pet_photo}
                                />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={style.title}>{strings.result}</Text>

                {
                    photoUri == '' ?
                    null :
                    <View style={style.processing_holder}>
                        <ActivityIndicator
                            style={{marginBottom: 16}}
                            size="large"
                            color={COLORS.dark}
                        />
                        
                        <Text style={style.msg}>{strings.msg_please_wait}</Text>
                    </View>
                }

                <Results/>
            </View>

            {/* BottomSheet Photo Dropdown */}
            {
                dropdown=='' ?
                    null
                :
                    <TouchableWithoutFeedback onPress={() => {setDropdown('')}}>
                        <View style={style.overlay}>
                            <BottomSheet
                                index={1}
                                snapPoints={snapPoints}
                                backgroundStyle={{borderWidth: 1}}
                                style={style.dropdown_bottomsheet}
                                enableOverDrag={false}
                                enablePanDownToClose={true}
                                onClose={() => {setDropdown('')}}
                            >
                                <DropdownOptions/>
                            </BottomSheet>
                        </View>
                    </TouchableWithoutFeedback>
            }
        </View>
    );
}

export default SearchingScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        height: '100%',
        paddingTop: 22,
        paddingLeft: 22,
        paddingRight: 22,
        paddingBottom: 22,
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'column',
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
    title: {
        color: COLORS.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        marginTop: 40,
    },
    guide_list_container: {
        height: '100%',
        width: '100%',
        marginTop: 20,
        marginBottom: '22%',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white
    },
    processing_holder: {
        marginTop: 28,
        alignItems: 'center'
    },
    msg: {
        color: COLORS.black,
        fontFamily: 'Roboto-Light',
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        color: COLORS.black,
        opacity: 0.8,
        marginBottom: 10,
    },
    pet_photo_holder: {
        width: '50%',
        height: 180,
        marginBottom: 4,
        alignSelf: 'center',
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
    dropdown_bottomsheet: {
        borderRadius: 10,
    },
    dropdown_option: {
        width: '99%',
        height: 60,
        padding: 24,
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
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
});