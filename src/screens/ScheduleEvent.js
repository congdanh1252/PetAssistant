import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import Dialog from "react-native-dialog";
import Toast from 'react-native-toast-message';
import PushNotification from "react-native-push-notification";


import COLORS from '../theme/colors';
import strings from '../data/strings';
import { windowHeight, windowWidth } from '../models/common/Dimensions'
import { 
    getReminder, 
    updateReminder,
    getPetsReminder
} from '../api/ReminderAPI';
import Reminder from '../models/reminder';
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

export function ScheduleEvent ({route, navigation}) {
    const [reminder, setReminder] = useState(new Reminder())
    const [title, setTitle] = useState(reminder.title)
    const [imgSoucre, setImgSource] = useState(WaitIcon);
    const [pets, setPets] = useState([]);
    const [addingPets, setAddingPets] = useState([]);
    const [selectedAddingPet, setSelectedAddingPet] = useState("")
    
    const [isEdit, setIsEdit] = useState(false)
    const [showMode, setShowMode] = useState('date')
    const [showDTPicker, setShowDTPicker] = useState(false)

    const [isShowDialog, setIsShowDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogDescription, setDialogDescription] = useState('')
    const [dialogInput, setDialogInput] = useState(false)
    
    const [deleteItem, setDeleteItem] = useState('')
    const [deleteItemType, setDeleteItemType] = useState('')

    const [addItemType, setAddItemType] = useState('')
    const [selectedFrequency, setSelectedFrequency] = useState(reminder.frequency)

    const showPicker = (mode) => {
        setShowDTPicker(true)
        setShowMode(mode)
    }

    const onFinishPicker = (event, selectedDate) => {
        const currentDate = selectedDate || reminder.datetime;
        reminder.datetime = currentDate;
        updateReminder(reminder)
        setShowDTPicker(false)
    }   

    const showDialog = () => {
        setIsShowDialog(true)
    }

    const handleCancel = () => {
        setIsShowDialog(false)
    }

    const handleDelete = () => {
        setIsShowDialog(false)
        if (dialogTitle.includes(strings.delete)) {
            switch (deleteItemType) {
                case 'pet':
                    console.log(deleteItem);
                    const index = reminder.pets.indexOf(deleteItem);
                    if (index > -1) {
                        reminder.pets.splice(index, 1)
                    }
                    updateReminder(reminder)
                    break;
                case 'job': 
                    const index1 = reminder.details.indexOf(deleteItem);
                    if (index1 > -1) {
                        reminder.details.splice(index1, 1)
                    }
                    updateReminder(reminder)
                    break;
                case 'eventType': 
                    break
                default:
                    break;
            }
        } else if (dialogTitle.includes(strings.edit)) {
            updateReminder(reminder)
        } else {
            switch (addItemType) {
                case 'pet':
                    console.log(selectedAddingPet);
                    if (selectedAddingPet != "null") {
                        reminder.pets.push(selectedAddingPet)
                        updateReminder(reminder)
                    }
                    break;
                case 'job': 
                    reminder.details.push(dialogInput)
                    updateReminder(reminder)
                    break;
                case 'eventType': 
                    reminder.type = dialogInput
                    break
                default:
                    break;
            }
        }
    }

    const PetName = (props) => {
        return (
            <View
                style={styles.petName}
            >
                {
                    isEdit && (
                        <View
                            style={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    showDialog()
                                    setDialogTitle(strings.deletePetInEvent)
                                    setDialogDescription(strings.confirmDeletePetInEvent)
                                    setDeleteItem(props.pet._id)
                                    setDeleteItemType('pet')
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
                    )
                }
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


                {
                    isEdit 
                    ? (
                        <TouchableOpacity
                            onPress={() => {
                                showDialog()
                                setDialogTitle(strings.deleteEventDetail)
                                setDialogDescription(strings.confirmDeleteEventDetail)
                                setDeleteItem(props.job)
                                setDeleteItemType('job')
                            }}
                        >
                            <Image
                                source={require('../assets/icons/Delete.png')}
                            />
                        </TouchableOpacity>
                    )
                    : null
                }
            </View>
        )
    }

    const handleCallback = (existPets, addingPets) => {
        setPets(existPets)
        setAddingPets(addingPets)
        if (addingPets.length > 0) {
            setSelectedAddingPet(addingPets[0]._id)
        }
    }

    const save = () => {
        PushNotification.cancelLocalNotification(reminder.notificationId);
        updateReminder(reminder);
        console.log(reminder.datetime);
        // var repeat_s = ''
        // switch (reminder.frequency) {
        //     case 'monthly':
        //         repeat_s = 'month'
        //         break;
        //     case 'yearly':
        //         repeat_s = 'year'
        //         break;
        //     default:
        //         break;
        // }
        PushNotification.localNotificationSchedule({
            id: reminder.notificationId,
            channelId: "test-channel",
            title: strings.incomingSchedule, 
            message: reminder.title + ":",
            date: reminder.datetime, 
        });
        Toast.show({
            type: 'success',
            text1: 'Thành công!',
            text2: 'Hoạt động đã được cập nhật thành công!'
        });
    }


    useEffect(() => {
        let isCancelled = false;
        const { reminder_id } = route.params
        console.log(reminder_id);
        getReminder(reminder_id, reminder => {
            try {
                if (!isCancelled) {
                    console.log(reminder);
                    setReminder(reminder);
                    setSelectedFrequency(reminder.frequency)
                    setTitle(reminder.title)
                    getPetsReminder(reminder.pets, handleCallback)
                    switch (reminder.type) {
                        case 'Food':
                            setImgSource(FoodIcon) 
                            break;
                        case 'Stuff':
                            setImgSource(StuffIcon) 
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

    return (
        <View
            style={styles.container}
        >
            {/* Header */}
            <View
                style={styles.headerContainer}
            >
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

                <Text
                    style={styles.title}
                >
                    {strings.editSchedule}
                </Text>

                {/* Edit button */}
                {
                    isEdit
                    ? (
                        <TouchableOpacity
                            onPress={() => {
                                save()
                                setIsEdit(!isEdit)
                            }}  
                        >
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    marginTop: 10,
                                    marginRight: 10
                                }}
                                source={require('../assets/icons/save.png')}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity

                            onPress={() => {
                                setIsEdit(!isEdit)
                            }}
                        >
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    marginTop: 20,
                                }}
                                source={require('../assets/icons/edit.png')}
                            />
                        </TouchableOpacity>
                    )
                }
            </View>

            {/* Sheet */}
            <View
                style={styles.bodyContainer}
            >
                <ScrollView>
                    {/* Title */}
                    <View>
                        <View style={styles.inputBox}>
                            <TextInput
                                editable={reminder.reminderType == "custom" && isEdit}
                                value={title}
                                onChangeText={value => {
                                    setTitle(value)
                                    reminder.title = value
                                }}
                                style={styles.input}
                                placeholder={strings.title}
                                placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                            >
                            </TextInput>
                        </View>
                    </View>

                    {/* Date time */}
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
                                {
                                    isEdit
                                    ? (
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
                                    ) : null
                                }
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
                                {
                                    isEdit
                                    ? (
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
                                    ) : null
                                }
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
                                    pets.length >= 1
                                    ? <PetName pet={pets[0]}/> 
                                    : null
                                }

                                {
                                    pets.length >= 2 
                                    ? <PetName pet={pets[1]}/> 
                                    : null
                                }      

                                {
                                    pets.length >= 3 
                                    ? <PetName pet={pets[2]}/> 
                                    : null
                                } 

                                {
                                    pets.length >= 4
                                    ?
                                    <View
                                        style={styles.petName}
                                    >
                                        <Text>
                                            {"+" + (pets.length - 3)}
                                        </Text>
                                    </View>
                                    : 
                                    null
                                }
                            </View>

                            {
                                isEdit && (
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
                                )
                            }
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
                            position: 'relative',
                        }}
                    >
                        {
                            reminder.reminderType == "core" 
                            ?
                            null :
                            isEdit
                            ? (
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
                            ) : null
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
                                enabled={isEdit}
                                style={{width: '70%'}}
                                selectedValue={selectedFrequency}
                                onValueChange={(itemValue, itemIndex) => {
                                    console.log(itemValue)
                                    reminder.frequency = itemValue
                                    updateReminder(reminder)
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
                    >
                    </View>
                
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
                        {
                            isEdit
                            ? (
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
                            ) : null
                        }
                    </View>

                    
                </ScrollView>
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
                        dialogTitle.includes(strings.delete)
                        ? null
                        : dialogTitle.includes(strings.edit)
                        ? (
                            <Picker
                                selectedValue={reminder.type}
                                onValueChange={(itemValue, itemIndex) => {
                                    reminder.type = itemValue
                                    switch (itemValue) {
                                        case 'Food':
                                            setImgSource(FoodIcon) 
                                            break;
                                        case 'Stuff':
                                            setImgSource(StuffIcon) 
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
                                <Picker.Item label="Mua sắm" value="Stuff" />
                                <Picker.Item label="Tắm" value="Shower" />
                                <Picker.Item label="Đi dạo" value="Walk" />
                                <Picker.Item label="Chải lông" value="HairBrush" />
                                <Picker.Item label="Vệ sinh" value="Sand" />
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
                                selectedValue={selectedAddingPet}
                                onValueChange={(itemValue, itemIndex) => {
                                    console.log(itemValue);
                                    setSelectedAddingPet(itemValue)
                                }}>
                                {
                                    addingPets.length > 0
                                    ?
                                    addingPets.map(pet => {
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
                            dialogTitle.includes(strings.delete)
                            ? strings.delete
                            : dialogTitle.includes(strings.edit) 
                            ? strings.save 
                            : strings.add
                        }
                        onPress={handleDelete}/>
            </Dialog.Container>

            {/* Picker */}

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
        justifyContent: 'space-between',
        position: 'relative',
        flex: 1.2,
    },
    title: {
        color: COLORS.white,
        fontSize: 20,
        alignSelf: 'center',
    },
    bodyContainer: {
        flex: 8.5,
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
    petName: {
        position: 'relative',
        backgroundColor: COLORS.grey,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
        marginRight: 4,
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
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

