import React, { useState, useMemo } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, Alert, TouchableHighlight
} from 'react-native'

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import BottomSheet from '@gorhom/bottom-sheet';
import { Button } from "react-native-elements/dist/buttons/Button";
import COLORS from '../theme/colors';
import strings from "../data/strings";
import BackButton from "../components/BackButton";
import Toast from "react-native-toast-message";

const FeedbackScreen = ({route, navigation}) => {
    const [detail, setDetail] = useState('');
    const [type, setType] = useState('');
    const [func, setFunc] = useState('');
    const [dropdown, setDropdown] = useState('');

    const [isUploading, setUploading] = useState(false);
    const snapPoints = useMemo(() => ['19%', '19%'], []);
    const snapPointsFunc = useMemo(() => ['57%', '57%'], []);

    const sendFeedbackToFirestore = () => {
        firestore()
        .collection('userFeedbacks')
        .add({
            user_id: auth().currentUser.uid,
            detail: detail,
            function: func,
            type: type,
            send_date: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
            handleCallback('Success');
        })
        .catch((e) => {
            handleCallback(e);
        });
    };

    const resetAllFields = () => {
        setDetail('');
        setType('');
        setFunc('');
    }

    const handleCancelAction = () => {
        Alert.alert(
            'Cảnh báo',
            'Bạn có chắc muốn đặt lại dữ liệu đã nhập?',
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

    const showResultToast = (result) => {
        if (result == 'Success') {
            Toast.show({
                type: 'success',
                text1: strings.success,
                text2: strings.msg_send_feedback_success,
                position: 'top',
                autoHide: true,
            });
        }
        else {
            Toast.show({
                type: 'error',
                text1: strings.fail,
                text2: strings.msg_add_pet_fail,
                position: 'top',
                autoHide: true,
            });
        }
    }

    const handleCallback = (result) => {
        setUploading(false);
        showResultToast(result);

        navigation.goBack();
    }

    const checkSubmitFields = () => {
        if (type=='' || detail=='' || func=='') {
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
            
            sendFeedbackToFirestore();
        }
    }

    const setValueFromDropdown = (value) => {
        switch (dropdown) {
            case 'Type':
                setType(value);
                break;
            default:
                setFunc(value);
        }

        setDropdown('');
    }

    const DropDownOptions = () => {
        var options = [];
        var optionViews = [];

        switch (dropdown) {
            case 'Type':
                options.push(strings.feedback_label, strings.report_label);
                break;
            default:
                options.push('Giao diện', strings.pet_management, strings.schedules, strings.expenditure_management,
                            strings.care_guide, strings.predictHeath, strings.else_option);
        }

        for (let i = 0; i < options.length; i++) {
            optionViews.push(
                <TouchableHighlight
                    key={i}
                    activeOpacity={0.7}
                    underlayColor='#EEEEEE'
                    style={
                        (options[i]==type || options[i]==func)
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
            <View>
                {optionViews}
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
                    {strings.feedback_n_report_label}
                </Text>
            </View>

            <TouchableWithoutFeedback
                onPress={() => { 
                    Keyboard.dismiss()
                }}
            >
                <View style={styles.container}>
                    {/* Content */}
                    <View style={styles.content}>
                        {/* Loại */}
                        <View style={styles.two_on_row}>
                            <View style={styles.input_holder_small}>
                                <Text style={styles.label}>{strings.u_want_label}</Text>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => { setDropdown('Type') }}
                                >
                                    <TextInput
                                        editable={false}
                                        style={styles.input}
                                        placeholderTextColor={'#898989'}
                                        placeholder={strings.feedback_label}
                                        value={type}
                                    />

                                    <Image
                                        source={require('../assets/icons/ic_down.png')}
                                        style={styles.down_icon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Tính năng */}
                        <View style={styles.input_holder}>
                            <Text style={styles.label}>{strings.function_label}</Text>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => { setDropdown('Func') }}
                            >
                                <TextInput
                                    editable={false}
                                    style={styles.input}
                                    placeholderTextColor={'#898989'}
                                    placeholder={strings.function_label}
                                    value={func}
                                />

                                <Image
                                    source={require('../assets/icons/ic_down.png')}
                                    style={styles.down_icon}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Nội dung */}
                        <View style={styles.input_holder}>
                            <Text style={styles.label}>{strings.content_label}</Text>

                            <TextInput
                                style={[styles.input, {height: 170}]}
                                multiline={true}
                                placeholderTextColor={'#898989'}
                                placeholder={strings.content_label}
                                value={detail}
                                onChangeText={value => {
                                    setDetail(value)
                                }}
                            />
                        </View>

                        {/* Save + Cancel buttons */}
                        <View style={styles.footer_buttons}>
                            <Button
                                title={strings.cancel}
                                titleStyle={styles.button_title}
                                buttonStyle={styles.button}
                                onPress={() => handleCancelAction()}
                            >
                            </Button>

                            <Button
                                title={strings.send_label}
                                titleStyle={styles.button_title}
                                buttonStyle={styles.button}
                                onPress={() => checkSubmitFields()}
                            >
                            </Button>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {/* Dropdown bottomsheet */}
            {
                dropdown=='' ?
                    null
                :
                    <TouchableWithoutFeedback onPress={() => setDropdown('')}>
                        <View style={styles.overlay}>
                            <BottomSheet
                                index={1}
                                snapPoints={dropdown=='Type' ? snapPoints : snapPointsFunc}
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

export default FeedbackScreen;

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
        paddingTop: 16,
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
    input_holder: {
        width: '100%',
        marginTop: 20,
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
    plus_icon: {
        width: 48,
        height: 48,
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
        marginTop: 200,
        marginBottom: 16,
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