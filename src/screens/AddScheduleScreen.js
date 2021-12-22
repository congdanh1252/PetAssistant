import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import Dialog from "react-native-dialog";
import Toast from 'react-native-toast-message';
import PushNotification from "react-native-push-notification";

import { windowHeight, windowWidth } from '../models/common/Dimensions'
import COLORS from '../theme/colors';
import strings from '../data/strings';
import {
    WaitIcon,
    DoctorIcon,
    FoodIcon,
    StuffIcon, 
    ShowerIcon,
    QuestionIcon,
    VaccineIcon,
    WalkIcon,
    HairBrushIcon,
    SandIcon
} from '../assets/icons/index'

import Reminder from '../models/reminder';
import { 
    addReminder,
} from '../api/ReminderAPI';
import Pet from '../models/pet';
import { getPetList } from '../api/PetAPI';

export function AddScheduleScreen({route, navigation}) {
    const [reminder, setReminder] = useState(new Reminder())
    const [pets, setPets] = useState([]);
    const [addingPets, setAddingPets] = useState([]);
    const [selectedAddingPet, setSelectedAddingPet] = useState(new Pet())
    const [selectedFrequency, setSelectedFrequency] = useState('custom')
    const [addItemType, setAddItemType] = useState('')
    const [imgSoucre, setImgSource] = useState(QuestionIcon);

    const [showMode, setShowMode] = useState('date')
    const [showDTPicker, setShowDTPicker] = useState(false)

    const [isShowDialog, setIsShowDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogDescription, setDialogDescription] = useState('')
    const [dialogInput, setDialogInput] = useState(false)
    
    const [deleteItem, setDeleteItem] = useState('')
    const [deleteItemType, setDeleteItemType] = useState('')

    const showPicker = (mode) => {
        setShowDTPicker(true)
        setShowMode(mode)
    }

    const onFinishPicker = (event, selectedDate) => {
        const currentDate = selectedDate || reminder.datetime;
        reminder.datetime = currentDate;
        setShowDTPicker(false)
    }  

    const PetName = (props) => {
        return (
            <View
                style={styles.petName}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            deleteInReminder(props.pet, 'pet')
                        }}
                    >
                        <Image
                            style={{
                                height: 16,
                                width: 16
                            }}
                            source={require('../assets/icons/Delete.png')}
                        />
                    </TouchableOpacity>
                </View>
                <Text>
                    {props.pet.name}
                </Text>
            </View>
        )
    }

    const EventDetails = (props) => {
        return (
            <View
                style={styles.eventJobs}
            >

                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/icons/Ok.png')}
                        />
                    </TouchableOpacity>
                    
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 16,
                            paddingHorizontal: 8,
                        }}
                    >
                        {props.job}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        deleteInReminder(props.job, 'job')
                    }}
                >
                    <Image
                        source={require('../assets/icons/Delete.png')}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const showDialog = () => {
        setIsShowDialog(true)
    }

    const handleCancel = () => {
        setIsShowDialog(false)
    }

    const deleteInReminder = (item, type) => {
        let index = -1;
        switch (type) {
            case 'pet':
                index = reminder.pets.indexOf(item._id);
                if (index > -1) {
                    reminder.pets.splice(index, 1)
                }

                index = addingPets.indexOf(item);
                if (index > -1) {
                    addingPets.splice(index, 1)
                    pets.push(item)
                    setSelectedAddingPet(pets[0])
                }

                break;
            case 'job': 
                console.log(item);
                index = reminder.details.indexOf(item);
                if (index > -1) {
                    reminder.details.splice(index, 1)
                }
                break;
            default:
                break;
        }
    }

    const handleDialogFinish = () => {
        setIsShowDialog(false)
        switch (addItemType) {
            case 'pet':
                if (selectedAddingPet._id != '') {
                    reminder.pets.push(selectedAddingPet._id)
                    addingPets.push(selectedAddingPet)

                    const index = pets.indexOf(selectedAddingPet)
                    if (index > -1) {
                        pets.splice(index, 1);
                        console.log(pets);
                        if (pets.length > 0) {
                            setSelectedAddingPet(pets[0])
                        } else {
                            setSelectedAddingPet(new Pets())
                        }
                    }
                }
                break;
            case 'job': 
                reminder.details.push(dialogInput)
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        let isCancelled = false
        getPetList(petList => {
            console.log(petList);
            try {
                if (!isCancelled) {
                    setPets(petList)
                    if (petList.length > 0) {
                        setSelectedAddingPet(petList[0])
                    }
                }
            } catch (error) {
                if (!isCancelled)
                    throw error;
            }
        })
        return () => {
            isCancelled = true
        }
    }, [])

    const checkData = () => {
        if (reminder.title == '') {
            Toast.show({
                type: 'error',
                text1: 'Thất bại!',
                text2: 'Vui lòng nhập tiêu đề cho hoạt động!'
            });
            result = false
        } 
    }

    const hanldleAddReminder = () => {
        reminder.frequency = selectedFrequency
        reminder.reminderType = 'custom'
        console.log(reminder);
        if (checkData()) {
            addReminder(reminder, (reminder) => {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công!',
                    text2: 'Đã thêm hoạt động mới!'
                });
                console.log(reminder._id);
                PushNotification.localNotificationSchedule({
                    id: reminder.notificationId,
                    channelId: "test-channel",
                    title: "PetAssistant", 
                    message: reminder.title,
                    date: new Date(reminder.datetime), 
                });
                navigation.goBack()
            })
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image 
                        style={{
                            marginTop: 10,
                            marginLeft: 10,
                        }}
                        source={require('../assets/icons/Back.png')}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {strings.addNewEvent}
                </Text>
            </View>

            {/* Body */}
            <View style={styles.bodyContainer}>
                <ScrollView>
                    {/* Title */}
                    <View>
                        <View style={styles.inputBox}>
                            <TextInput
                                onChangeText={value => {
                                    reminder.title = value
                                }}
                                style={styles.input}
                                placeholder={strings.title}
                                placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                            >
                            </TextInput>
                        </View>
                    </View>
                    {/* Datetime */}
                    <View
                        style={styles.dateTimeContainer}
                    >
                        <View>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={styles.detail}
                                >
                                    {
                                        selectedFrequency == "daily"
                                        ? "Hằng ngày"
                                        : selectedFrequency == "weekly"
                                        ? moment(reminder.datetime).format('dddd')
                                        : selectedFrequency == "monthly"
                                        ? moment(reminder.datetime).format('DD') + " hằng tháng"
                                        : moment(reminder.datetime).format('dddd, D MMMM')
                                    }
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        showPicker('date')
                                    }}
                                >
                                    <Image
                                        style={{
                                            marginLeft: 4,
                                        }}
                                        source={require('../assets/icons/Pen.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <Text
                                style={styles.sectionTitle}
                            >
                                {strings.date}
                            </Text>
                        </View>
                        
                        <View>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    style={styles.detail}
                                >
                                    {moment(reminder.datetime).format('hh:mm A')}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        showPicker('time')
                                    }}
                                >
                                    <Image
                                        style={{
                                            marginLeft: 4,
                                        }}
                                        source={require('../assets/icons/Pen.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text
                                style={styles.sectionTitle}
                            >
                                {strings.time}
                            </Text>
                        </View>
                    </View>

                    {/* Pet names */}
                    <View
                        style={{
                            marginTop: 16,
                            marginBottom: 16,
                        }}
                    >

                        <View
                            style={styles.petsContainer}
                        >
                            
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {
                                    addingPets.length >= 1
                                    ? <PetName pet={addingPets[0]}/> 
                                    : null
                                }

                                {
                                    addingPets.length >= 2 
                                    ? <PetName pet={addingPets[1]}/> 
                                    : null
                                }      

                                {
                                    addingPets.length >= 3 
                                    ? <PetName pet={addingPets[2]}/> 
                                    : null
                                } 

                                {
                                    addingPets.length >= 4
                                    ?
                                    <View
                                        style={styles.petName}
                                    >
                                        <Text>
                                            {"+" + (addingPets.length - 3)}
                                        </Text>
                                    </View>
                                    : 
                                    null
                                }
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setIsShowDialog(true)
                                    setAddItemType('pet')
                                    setDialogTitle(strings.addPetInEvent)
                                    setDialogDescription(strings.enterPetName)
                                }}                        
                            >
                                <Image 
                                    style={{
                                        height: 32,
                                        width: 32,
                                    }}
                                    source={require('../assets/icons/Add.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        


                        <Text
                            style={styles.sectionTitle}
                        >
                            {strings.pet}
                        </Text>
                    </View>  

                    {/* Type */}
                    <View
                        style={{
                            marginTop: 30,
                            position: 'relative',
                        }}
                    >
                        {
                            <View
                                style={{
                                    position: 'absolute',
                                    top: -4,
                                    left: 28,
                                    elevation: 1,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() =>{
                                        setAddItemType('type')
                                        setIsShowDialog(true)
                                        setDialogTitle(strings.editType)
                                        setDialogDescription(strings.type)
                                    }}
                                >
                                    <Image
                                        style={{
                                            height: 16,
                                            width: 16
                                        }}
                                        source={require('../assets/icons/Pen.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        }

                        <Image
                            source={imgSoucre}
                        />
                        <Text
                            style={styles.sectionTitle}
                        >
                            {strings.type}
                        </Text>
                    </View>

                     {/* Frequency */}
                    <View>
                        <View
                            style={styles.rowContainer}
                        >
                            <Picker
                                enabled={true}
                                style={{width: '70%'}}
                                selectedValue={selectedFrequency}
                                onValueChange={(itemValue, itemIndex) => {
                                    console.log(itemValue)
                                    reminder.frequency = itemValue
                                    setSelectedFrequency(itemValue)
                                }}
                            >
                                <Picker.Item label="Hằng ngày" value="daily" />
                                <Picker.Item label="Hằng tuần" value="weekly" />
                                <Picker.Item label="Hằng tháng" value="monthly" />
                                <Picker.Item label="Không lặp lại" value="custom" />
                            </Picker>
                            </View>

                        <Text
                            style={styles.sectionTitle}
                        >
                            {strings.frequency}
                        </Text>
                    </View>

                    {/* Seperate line */}
                    <View
                        style={styles.line}
                    ></View>

                    {/* Details */}
                    <View
                        style={styles.detailsContainer}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto-Medium',
                                fontSize: 18,
                                marginBottom: 16,
                            }}
                        >
                            {strings.detail}
                        </Text>
                        {
                            reminder.details.map(job => {
                                return (
                                    <EventDetails
                                        job={job}
                                        key={job}
                                    />
                                )
                            })
                        }

                        <TouchableOpacity
                            onPress={() => {
                                setAddItemType('job')
                                showDialog()
                                setDialogTitle(strings.addDetailInEvent)
                                setDialogDescription(strings.enterDetailDescription)
                            }}
                        >
                            <Text
                                style={{
                                    marginLeft: 16,
                                    marginTop: 16,
                                    fontFamily: 'Roboto-LightItalic'
                                }}
                            >
                                {strings.addNewEvent}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <TouchableOpacity
                    onPress={() => {
                        hanldleAddReminder()
                    }}
                >
                    <Image
                        style={{
                            marginLeft: 'auto'
                        }}
                        source={require('../assets/icons/save.png')}
                    />
                </TouchableOpacity>
            </View>

            {/* Datetime Picker */}
            {
                showDTPicker && (
                    <DateTimePicker  
                        value={reminder.datetime}
                        mode={showMode}
                        is24Hour={true}
                        display="default"
                        onChange={onFinishPicker}
                    />
                )
            }

            {/* Dialog */}
            <Dialog.Container
                visible={isShowDialog}
            >
                <Dialog.Title
                    style={{
                        fontFamily: 'Roboto-Bold'
                    }}
                >
                    {dialogTitle}
                </Dialog.Title>
                    <Dialog.Description
                        style={{
                            fontFamily: 'Roboto-LightItalic',
                            fontSize: 14,
                        }}
                    >
                        {dialogDescription}
                    </Dialog.Description>
                    {
                   
                        dialogTitle.includes(strings.edit)
                        ? (
                            <Picker
                                selectedValue={reminder.type}
                                onValueChange={(itemValue, itemIndex) => {
                                    reminder.type = itemValue
                                    console.log(reminder.type);
                                    switch (itemValue) {
                                        case 'Food':
                                            setImgSource(FoodIcon) 
                                            break;
                                        case 'HairBrush':
                                            setImgSource(HairBrushIcon) 
                                            break;
                                        case 'Walk':
                                            setImgSource(WalkIcon) 
                                            break;
                                        case 'Doctor': 
                                            setImgSource(DoctorIcon) 
                                            break
                                        case 'Vaccine':
                                            setImgSource(VaccineIcon)
                                            break
                                        case 'Shower': 
                                            setImgSource(ShowerIcon) 
                                            break
                                        case 'Sand': 
                                            setImgSource(SandIcon) 
                                            break
                                        default:
                                            setImgSource(QuestionIcon) 
                                            break;
                                    }
                                }}>
                                <Picker.Item label="Tiêm ngừa" value="Vaccine" />
                                <Picker.Item label="Khám bệnh" value="Doctor" />
                                <Picker.Item label="Tắm" value="Shower" />
                                <Picker.Item label="Đi dạo" value="Walk" />
                                <Picker.Item label="Chải lông" value="HairBrush" />
                                <Picker.Item label="Dọn cát" value="Sand" />
                                <Picker.Item label="Cho ăn" value="Food" />
                                <Picker.Item label="Khác" value="Other" />
                            </Picker>
                        ) :
                        dialogTitle.includes(strings.addDetailInEvent)
                        ? (
                            <View style={styles.inputBox}>
                                <TextInput
                                    onChangeText={value => {
                                        setDialogInput(value)
                                    }}
                                    style={styles.input}
                                    placeholder='ABC'
                                    placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                                >
                                </TextInput>
                            </View>
                        ) : (
                            <Picker
                                selectedValue={selectedAddingPet._id}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedAddingPet(itemValue)
                                }}>
                                {
                                    pets.length > 0
                                    ?

                                    pets.map(pet => {
                                        return (
                                            <Picker.Item key={pet._id} label={pet.name} value={pet._id} />
                                        )
                                    })
                                    : (
                                        <Picker.Item key={null} label={strings.noPet} value={null} />
                                    )
                                }
                            </Picker>
                        )
                    }

                    <Dialog.Button 
                        label={strings.cancel}
                        onPress={handleCancel}    
                    />
                    <Dialog.Button 
                        label={
                            dialogTitle.includes(strings.edit) 
                            ? strings.save 
                            :
                            strings.add
                        }
                        onPress={handleDialogFinish}/>
            </Dialog.Container>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark,
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        flex: 1,
    },
    title: {
        color: COLORS.white,
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    bodyContainer: {
        flex: 9,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 28, 
    },
    dateTimeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        color: COLORS.dark,
        fontFamily: 'Roboto-Regular',
        marginTop: 4,
    },
    detail: {
        color: COLORS.dark,
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
    },
    petsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eventJobs: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
    },
    petName: {
        position: 'relative',
        backgroundColor: COLORS.grey,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
        marginRight: 4,
    },
    line: {
        backgroundColor: COLORS.dark,
        width: '80%',
        marginTop: 16, 
        marginBottom: 16,
        height: .5,
        alignSelf: 'center'
    },
    input: {
        position: 'relative',
        width: windowWidth - windowWidth / 6,
        color: "#000",
        textAlign: 'center',
        backgroundColor: '#EEEEEE',
        borderRadius: 15,
        padding: 10,
    },
    inputBox: {
        alignItems: 'center',
        marginBottom: 20,
    },
})
