import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Dialog from "react-native-dialog";
import Toast from 'react-native-toast-message';

import COLORS from '../theme/colors';
import strings from '../data/strings';
import { windowHeight, windowWidth } from '../models/common/Dimensions'
import { getReminder, updateReminder } from '../api/ReminderAPI';
import Reminder from '../models/reminder';

export function ScheduleEvent () {
    const [reminder, setReminder] = useState(new Reminder('mFhQleRM88v03oGDNRDG'))
    
    const [isEdit, setIsEdit] = useState(false)
    const [showMode, setShowMode] = useState('date')
    const [showDTPicker, setShowDTPicker] = useState(false)

    const [isShowDialog, setIsShowDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogDescription, setDialogDescription] = useState('')
    const [dialogInput, setDialogInput] = useState(false)
    
    const [deleteItem, setDeleteItem] = useState('')
    const [deleteItemType, setDeleteItemType] = useState('')

    const [addItem, setAddItem] = useState('')
    const [addItemType, setAddItemType] = useState('')

    const showPicker = (mode) => {
        console.log("Show picker")
        setShowDTPicker(true)
        setShowMode(mode)
    }

    const onFinishPicker = (event, selectedDate) => {
        const currentDate = selectedDate || reminder.datetime;
        setShowDTPicker(false)
        reminder.datetime = currentDate;
        updateReminder(reminder)
    }   

    const showDialog = () => {
        setIsShowDialog(true)
    };

    const handleCancel = () => {
        setIsShowDialog(false)
    }

    const handleDelete = () => {
        setIsShowDialog(false)
        if (dialogTitle.includes(strings.delete)) {
            switch (deleteItemType) {
                case 'pet':
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
        } else {
            switch (addItemType) {
                case 'pet':
                    reminder.pets.push(dialogInput)
                    updateReminder(reminder)
                    break;
                case 'job': 
                    reminder.details.push(dialogInput)
                    updateReminder(reminder)
                    break;
                case 'eventType': 
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
                                    setDeleteItem(props.name)
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
                    {props.name}
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

    // useEffect(() => {
    //     const unsubscribe = firestore()
    //     .collection('users/VbNsDN6X1EgC4f0FfXAQvtZJ21q2/reminders')
    //     .doc(reminder._id)
    //     .onSnapshot(documentSnapshot => {
    //         console.log('Got reminder result.')
    //         var rmd = new Reminder()
    //         rmd.update(documentSnapshot.data())
    //         rmd.datetime = documentSnapshot.data().datetime.toDate()
    //         rmd._id = reminder._id
    //         setReminder(rmd)
    //     });
    //     return () => {
    //       unsubscribe()
    //     }
    // }, [firestore()])

    const handleReminderCallback = (reminder) => {
        var rmd = new Reminder()
        rmd.update(reminder)
        setReminder(rmd)
    }

    useEffect(() => {
        const unsubscribe = getReminder(reminder._id, handleReminderCallback)
        return () => {
            unsubscribe
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
                <TouchableOpacity>
                    <Image 
                        style={{
                            margin: 8,
                        }}
                        source={require('../assets/icons/Back.png')}
                    />
                </TouchableOpacity>

                {
                    isEdit
                    ? (
                        null
                    ) : (
                        <Text
                            style={styles.title}
                        >
                            {reminder.title}
                        </Text>
                    )
                }

                
            </View>

            {/* Sheet */}
            <View
                style={styles.bodyContainer}
            >

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
                                {moment(reminder.datetime).format('dddd, D MMMM')}
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
                                reminder.pets.length >= 1
                                ? <PetName name={reminder.pets[0]}/> 
                                : null
                            }

                            {
                                reminder.pets.length >= 2 
                                ? <PetName name={reminder.pets[1]}/> 
                                : null
                            }      

                            {
                                reminder.pets.length >= 3 
                                ? <PetName name={reminder.pets[2]}/> 
                                : null
                            } 

                            {
                                reminder.pets.length >= 4
                                ?
                                <View
                                    style={styles.petName}
                                >
                                    <Text>
                                        {"+" + (reminder.pets.length - 3)}
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
                                        showDialog()
                                        setDeleteItemType('eventType')
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
                        source={require('../assets/icons/Shower.png')}
                    />
                    <Text
                        style={styles.sectionTitle}
                    >
                        {strings.type}
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

                {/* Edit button */}
                {
                    isEdit
                    ? (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 32,
                                right: 32,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setIsEdit(!isEdit)
                                    Toast.show({
                                        type: 'success',
                                        text1: strings.success,
                                        text2: strings.saveSuccessful
                                    });
                                }}  
                            >
                                <Image
                                    source={require('../assets/icons/save.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 32,
                                right: 32,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setIsEdit(!isEdit)
                                }}
                            >
                                <Image
                                    source={require('../assets/icons/edit.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    )
                }
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
                    : (
                        <View style={styles.inputBox}>
                            <TextInput
                                onChangeText={value => {
                                    setDialogInput(value)
                                }}
                                style={styles.input}
                                placeholder='ABCDEF'
                                placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                            >
                            </TextInput>
                        </View>
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
                        : strings.add
                    }
                    onPress={handleDelete}/>
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
        flex: 1.5,
    },
    title: {
        color: COLORS.white,
        fontSize: 28,
        marginLeft: '20%',
    },
    bodyContainer: {
        flex: 8.5,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 36, 
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
})

