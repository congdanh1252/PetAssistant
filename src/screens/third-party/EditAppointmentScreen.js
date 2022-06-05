import React, { useEffect, useState } from "react";
import {
    StyleSheet, View, TextInput, Text, TouchableOpacity, Image, TouchableWithoutFeedback,
    Keyboard, Alert,
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements/dist/buttons/Button";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import firestore from '@react-native-firebase/firestore';

import COLORS from '../../theme/colors';
import strings from "../../data/strings";
import BackButton from "../../components/BackButton";
import Appointment from "../../models/appointment";
import ServiceItem from "../../models/serviceItem";
import Reminder from '../../models/reminder';
import { updateAppointmentAfterConfirm } from "../../api/ThirdPartyAPI";
import {
    addReminder,
    addReminderUser
} from "../../api/third-party/ReminderAPI"


const EditAppointmentScreen = ({route, navigation}) => {
    var appointment = new Appointment();
    const { apmId, third_party } = route.params;
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [timeDisplay, setTimeDisplay] = useState('');
    const [services, setServices] = useState([]);
    const [choseService, setChoseService] = useState([]);
    const [note, setNote] = useState('');
    const [appointment2, setAppointment2] = useState(new Appointment())
    const [isUploading, setUploading] = useState(false);

    const [show, setShow] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const onChangeTime = (event, selectedTime) => {
        setShow(false)
        if (selectedTime != null) {
            const val = new Date(selectedTime)
            setTime(selectedTime)
            setTimeDisplay(val.getHours().toString() + ":" + String(val.getMinutes()).padStart(2, '0'))
        }
    };

    const onChangeDate = (event, selectedDate) => {
        if (selectedDate != null) {
          setDate(selectedDate)
        }
        setShowDate(false)
    };

    const initAppointmentData = () => {
      appointment._id = apmId;
      appointment.service = choseService;
      appointment.appointment_date = date;
      appointment.appointment_time = time;
      appointment.note = note;
    }

    const checkSubmitFields = () => {
        console.log(name)
        if (name=='' || phoneNumber=='' || date=='' || time=='' || choseService.length < 1) {
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

            initAppointmentData()

            

            updateAppointmentAfterConfirm(appointment, handleAppointmentUpdated)
        }
    }

    const addReminder3Party = () => {

        let reminder = new Reminder()
        let date = new Date(appointment.appointment_time)
        let date_2 = new Date(appointment.appointment_date)
        date.setDate(date_2.getDate())
        date.setMonth(date_2.getMonth())
        date.setFullYear(date_2.getFullYear())
        
        
        reminder.customer = appointment2.customer_id
        reminder.datetime = date
        reminder.description = appointment.note
        reminder.service = appointment.service
        reminder.title = appointment2.customer_name + " đặt lịch"
        reminder.type = "Service"
        reminder.reminderType = "custom"

        addReminder(reminder, (reminder) => {
            console.log("add3party:" +reminder)

           _addReminderUser()
        })
    }

    const _addReminderUser = () => {

        let reminder = new Reminder()
        let date = new Date(appointment.appointment_time)
        let date_2 = new Date(appointment.appointment_date)
        date.setDate(date_2.getDate())
        date.setMonth(date_2.getMonth())
        date.setFullYear(date_2.getFullYear())
        
        reminder.datetime = date
        reminder.description = appointment.note
        reminder.details = appointment.service
        reminder.title = appointment2.third_party_name
        reminder.frequency = "custom"
        reminder.type = "Service"
        reminder.reminderType = "custom"
        reminder.pets = []

        addReminderUser(reminder, appointment2.customer_id, (reminder) => {
            console.log("user:" +reminder)

            setUploading(false);
            showResultToast("Success");
    
            navigation.goBack();
        })
    }

    const showResultToast = (result) => {
      if (result == 'Success') {
          Toast.show({
              type: 'success',
              text1: strings.success,
              text2: strings.msg_proceed_appointment_success,
              position: 'top',
              autoHide: true,
          });
      }
      else {
          Toast.show({
              type: 'error',
              text1: strings.fail,
              text2: strings.err_check_inputs,
              position: 'top',
              autoHide: true,
          });
          console.log(result)
      }
    }

    const handleAppointmentUpdated = () => {

        addReminder3Party()


    }

    const updateServices = (element) => {
        let newList = [];

        for (let i = 0; i < choseService.length; i++) {
            newList.push(choseService[i]);
        }
        if (!newList.includes(element)) {
            newList.push(element);

            setChoseService(newList);
        }
    }

    const removeItemOnClick = (item) => {
        if (choseService.length > 1) {
            let listItem = [];

            for (let i = 0; i < choseService.length; i++) {
                if (choseService[i] != item) {
                    listItem.push(choseService[i])
                }
            }

            setChoseService(listItem)
        }
    }

    //load list items
    useEffect(() => {
        const subscriber = firestore()
        .collection('appointment')
        .doc(apmId)
        .onSnapshot(documentSnapshot => {
            var item = new Appointment()
            item.update(documentSnapshot.data())
            item._id = documentSnapshot.id
            appointment.update(item)
            setAppointment2(item)

            setName(item.customer_name)
            setPhoneNumber(item.customer_phone_number)
            setNote(item.note)
            setChoseService(item.service)
            const val = new Date(item.appointment_time.toDate())
            setTime(val)
            setDate(new Date(item.appointment_date.toDate()))
            setTimeDisplay(val.getHours().toString() + ":" + String(val.getMinutes()).padStart(2, '0'))
        })

        const serviceFetching = firestore()
        .collection('thirdParty/' + third_party + '/service')
        .onSnapshot(querySnapshot => {
            var services = new Array();
            querySnapshot.forEach(documentSnapshot => {
                var item = new ServiceItem();
                item.update(documentSnapshot.data());
                item._id = documentSnapshot.id;
                item.active ? services.push(item) : null;
            });
            
            setServices(services)
        })

        return () => {
            subscriber()
            serviceFetching()
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
                    Xác nhận lịch hẹn
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
                    }}
                >
                    <View style={styles.container}>
                        {/* Content */}
                        <View style={styles.content}>
                            {/* Name + Phone number */}
                            <View style={styles.two_on_row}>
                                {/* Name */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.customer_label}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            keyboardType={'default'}
                                            textContentType={"name"}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.name}
                                            editable={false}
                                            value={name}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Phone number */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.phone}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            keyboardType={'numeric'}
                                            textContentType={"telephoneNumber"}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.phone}
                                            editable={false}
                                            value={phoneNumber}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Date + Time */}
                            <View style={styles.two_on_row}>
                                {/* Date */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.appointment_date_label}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setShowDate(true)
                                        }}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            editable={false}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.appointment_date_label}
                                            value={
                                                String(date.getDate()).padStart(2, '0') + "-" +
                                                String(date.getMonth() + 1).padStart(2, '0') + "-" +
                                                date.getFullYear().toString()
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Time */}
                                <View style={styles.input_holder_small}>
                                    <Text style={styles.label}>{strings.time}</Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setShow(!show)
                                        }}
                                    >
                                        <TextInput
                                            style={styles.input}
                                            editable={false}
                                            keyboardType={'default'}
                                            placeholderTextColor={'#898989'}
                                            placeholder={strings.time}
                                            value={timeDisplay}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Service items */}
                            <View style={styles.service_container}>
                                <Text style={[styles.label, {marginBottom: -8}]}>{strings.content_label}</Text>

                                <View style={styles.services_add_holder}>
                                    <View style={styles.services}>
                                        {
                                            choseService.map((item) => {
                                                return (
                                                    <View style={styles.service_item_holder} key={item}>
                                                        <TextInput
                                                            style={styles.input}
                                                            editable={false}
                                                            keyboardType={'numeric'}
                                                            textContentType={"telephoneNumber"}
                                                            placeholderTextColor={'#898989'}
                                                            value={item}
                                                        />

                                                        <TouchableOpacity
                                                            activeOpacity={0.7}
                                                            style={styles.remove_item_icon}
                                                            onPress={() => {
                                                                removeItemOnClick(item)
                                                            }}
                                                        >
                                                            <Text style={{fontSize: 22, color: '#fff'}}>-</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>

                                    {/* Add icon */}
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{marginTop: 16}}
                                        onPress={() => {

                                        }}
                                    >
                                        <Image
                                            style={styles.plus_icon}
                                            source={require('../../assets/icons/Add.png')}
                                        />

                                        <Picker
                                            style={[styles.plus_icon, {marginTop: -44, marginLeft: 5, opacity: 0, backgroundColor: COLORS.green}]}
                                            selectedValue={choseService}
                                            onValueChange={(itemValue, itemIndex) => {
                                                updateServices(itemValue)
                                            }}>
                                                {
                                                    services.map((element) => {
                                                        return (
                                                            <Picker.Item label={element.detail} value={element.detail} key={element.description}/>
                                                        )
                                                    })
                                                }
                                        </Picker>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Note */}
                            <View style={[styles.input_holder, {marginTop: 26}]}>
                                <Text style={styles.label}>{strings.note_label}</Text>

                                <TextInput
                                    editable={true}
                                    style={[styles.input, {height: 116}]}
                                    multiline={true}
                                    placeholderTextColor={'#898989'}
                                    placeholder={strings.note_label}
                                    value={note}
                                    onChangeText={(value) => {
                                        setNote(value)
                                    }}
                                />
                            </View>

                            {/* Finish + Cancel buttons */}
                            <View style={styles.footer_buttons}>
                                <Button
                                    title={strings.cancel}
                                    titleStyle={styles.button_title}
                                    buttonStyle={styles.button}
                                    onPress={() => navigation.goBack()}
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

            {/* Date Picker */}
            {
                showDate ? (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={'date'}
                        is24Hour={true}
                        display="spinner"
                        onChange={onChangeDate}
                    />
                ) : null
            }

            {/* Time Picker */}
            {
                show ? (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={'time'}
                        is24Hour={true}
                        display="spinner"
                        onChange={onChangeTime}
                    />
                ) : null
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

export default EditAppointmentScreen;

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
    plus_icon: {
        width: 36,
        height: 36,
    },
    remove_item_icon: {
        position: 'absolute',
        right: -6,
        top: -6,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black
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
    service_container: {
        width: '100%',
        marginTop: 24,
    },
    services_add_holder: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    services: {
        flexDirection: 'row',
        width: '90%',
        flexWrap: 'wrap'
    },
    service_item_holder: {
        marginTop: 16,
        alignSelf: 'flex-start',
        marginRight: 12,
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
        marginTop: 90,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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