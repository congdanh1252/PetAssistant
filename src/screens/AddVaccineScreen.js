import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, TouchableHighlight, Alert,
} from 'react-native'
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import BottomSheet from '@gorhom/bottom-sheet';
import DateTimePicker from "@react-native-community/datetimepicker";

import { Button } from "react-native-elements/dist/buttons/Button";
import COLORS from '../theme/colors';
import strings from "../data/strings";
import BackButton from "../components/BackButton";
import Toast from "react-native-toast-message";

const AddVaccineScreen = ({route, navigation}) => {

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton
                    container={''}
                    navigation={navigation}
                />

                <Text style={styles.header_title}>
                    Thêm vắc-xin
                </Text>
            </View>

            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss()
                    // setDropdown('');
                }}
            >
                <View style={styles.container}>
                    {/* Content */}
                    <View style={styles.content}>
                        {/* Photo */}
                        <View style={styles.pet_photo_holder}>
                            <Text style={styles.label}>
                                Nhãn vắc-xin
                            </Text>

                            <TouchableOpacity
                                style={styles.photo_picker}
                                activeOpacity={0.7}
                                onPress={() => {}}
                            >
                                <View style={styles.plus_icon}>
                                    <Image
                                        source={require('../assets/icons/Add.png')}
                                        style={styles.plus_icon}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Kind + Gender */}
                        <View style={styles.two_on_row}>
                            {/* Kind */}
                            <View style={styles.input_holder_small}>
                                <Text style={styles.label}>Mũi tiêm</Text>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {}}
                                >
                                    <TextInput
                                        editable={false}
                                        style={styles.input}
                                        placeholderTextColor={'#898989'}
                                        placeholder={'Mũi tiêm'}
                                        
                                    />

                                    <Image
                                        source={require('../assets/icons/ic_down.png')}
                                        style={styles.down_icon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Name */}
                        <View style={styles.input_holder}>
                            <Text style={styles.label}>Chi tiết</Text>

                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'#898989'}
                                placeholder={'Chi tiết mũi tiêm'}
                                onChangeText={value => {
                                    
                                }}
                            />
                        </View>

                        {/* Ngày tiêm */}
                        <View style={styles.two_on_row}>
                            <View style={styles.input_holder_small}>
                                <Text style={styles.label}>Ngày tiêm</Text>

                                <TextInput
                                    editable={false}
                                    style={styles.input}
                                    placeholderTextColor={'#898989'}
                                    placeholder={'Ngày tiêm'}
                                    
                                />
                            </View>

                            {/* Calendar icon */}
                            <View style={[styles.input_holder_small, {alignItems: 'center'}]}>
                                <TouchableOpacity
                                    style={{width: '36%', alignItems: 'center', marginTop: 40,}}
                                    activeOpacity={0.6}
                                    onPress={() => {}}
                                >
                                    <Image
                                        source={require('../assets/icons/ic_calendar.png')}
                                        style={styles.plus_icon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Ngày tái chủng */}
                        <View style={styles.two_on_row}>
                            <View style={styles.input_holder_small}>
                                <Text style={styles.label}>Ngày tái chủng</Text>

                                <TextInput
                                    editable={false}
                                    style={styles.input}
                                    placeholderTextColor={'#898989'}
                                    placeholder={'Ngày tái chủng'}
                                    
                                />
                            </View>

                            {/* Calendar icon */}
                            <View style={[styles.input_holder_small, {alignItems: 'center'}]}>
                                <TouchableOpacity
                                    style={{width: '36%', alignItems: 'center', marginTop: 40,}}
                                    activeOpacity={0.6}
                                    onPress={() => {}}
                                >
                                    <Image
                                        source={require('../assets/icons/ic_calendar.png')}
                                        style={styles.plus_icon}
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
                                onPress={() => {}}
                            >
                            </Button>

                            <Button
                                title={strings.save}
                                titleStyle={styles.button_title}
                                buttonStyle={styles.button}
                                onPress={() => {}}
                            >
                            </Button>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default AddVaccineScreen;

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
        width: '35%',
        height: 160,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photo_picker: {
        width: '100%',
        height: 130,
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
        width: 45,
        height: 45,
    },
    input_holder: {
        width: '100%',
        marginTop: 22,
    },
    input_holder_small: {
        width: '45%',
        marginTop: 12,
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
        marginTop: 60,
        marginBottom: 20,
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