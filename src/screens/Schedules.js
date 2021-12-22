import React, {useEffect, useCallback, useMemo, useRef, useState  } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';
import { Agenda, Calendar, CalendarList } from 'react-native-calendars'
import {LocaleConfig} from 'react-native-calendars';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';


import COLORS from '../theme/colors';
import {windowHeight, windowWidth} from '../models/common/Dimensions'
import {
    getDateReminder,
    getPetsReminder,
    getMonthReminderDate
} from '../api/ReminderAPI'
import {
    WaitIcon,
    DoctorIcon,
    FoodIcon,
    StuffIcon, 
    ShowerIcon
} from '../assets/icons/index'

LocaleConfig.locales['vi'] = {
  monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
  monthNamesShort: ['Tha.1','Tha.2','Tha.3','Tha.4','Tha.5','Tha.6','Tha.7','Tha.8','Tha.9','Tha.10','Tha.11','Tha.12'],
  dayNames: ['Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy','Chủ nhật'],
  dayNamesShort: ['T2','T3','T4','T5','T6','T7','CN'],
  today: 'Hôm nay'
};
LocaleConfig.defaultLocale = 'vi';

export function Schedules ({navigation}) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    // variables
    const snapPoints = useMemo(() => ['50%', '80%'], [])
    const [state, setState] = useState(0)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [reminderList, setReminderList] = useState([])
    const [oldReminderList, setOldReminderList] = useState([])
    const [dates, setDates] = useState([])
    const [monthData, setMonthData] = useState(JSON)

    const PetsName = (props) => {
        const [pets, setPets] = useState([])

        useEffect(() => {
            let isCancelled = false;
            getPetsReminder(props.pets, (existPets, addingPets) => {
                try {
                    if (!isCancelled) {
                        setPets(existPets)
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
                style={styles.petsContainer}
            >
                {
                    pets[0] != null 
                    ? (
                    <View
                        style={styles.petName}
                    >
                        <Text>
                            {pets[0].name}
                        </Text>
                    </View>
                    ) : null
                }
                
                {
                    pets[1] != null 
                    ? (
                    <View
                        style={styles.petName}
                    >
                        <Text>
                            {pets[1].name}
                        </Text>
                    </View>
                    ) : null
                }

                {
                    pets.length > 2
                    ?
                    <View
                        style={styles.petName}
                    >
                        <Text>
                            {"+" + (pets.length - 2)}
                        </Text>
                    </View>
                    : 
                    null
                }
            </View>
        )
    }

    useEffect(() => {
        let isCancelled = false;
        getDateReminder(selectedDate, (reminderList, oldReminderList) => {
            try {
                if (!isCancelled) {
                    console.log(reminderList);
                    setReminderList(reminderList)
                    setOldReminderList(oldReminderList)
                }
            } catch (error) {
                if (!isCancelled)
                    throw error;
            }
        })
        return () => {
            isCancelled = true
        }
    }, [selectedDate])

    useEffect(() => {
        let isCancelled = false;
        getMonthReminderDate(selectedDate, dates => {
            try {
                if (!isCancelled) {
                    console.log(dates);
                    var today = new Date()
                    let data = "{"
                    for (var i = 0; i < dates.length; i++) {
                        if (dates[i] < today.getDate()) {
                            data += '"' + selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + dates[i] + '"'
                            + ': {"marked": true}'
                        } else {
                            data += '"' + selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + dates[i] + '"'
                            + ': {"marked": true}'
                        }
                        
                        if (i != dates.length - 1) {
                            data += ","
                        } 
                    }
                    // dates.forEach(date => {
                    //     data += '"' + selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + date + '"'
                    //     + ': {"marked": true}'
                    //     if (date.) 
                    // });
                    data += '}'
                    console.log(data);
                    setMonthData(JSON.parse(data))
                    //console.log(data);
                }
            } catch (error) {
                if (!isCancelled)
                    throw error;
            }
        })
        return () => {
            isCancelled = true
        }
    }, [selectedDate])

    const CalendarEvent = (props) => {
        switch (props.reminder.type) {
            case 'Food':
                imgSource = FoodIcon
                break;
            case 'Stuff':
                imgSource = StuffIcon
                break;
            case 'Doctor': 
                imgSource = DoctorIcon
                break
            case 'Shower': 
                imgSource = ShowerIcon
                break
            default:
                imgSource = WaitIcon;
                break;
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    //console.log(props.reminder._id);
                    navigation.navigate('ScheduleEvent', {
                        reminder_id: props.reminder._id
                    })
                }}
                style={[styles.eventContainer, 
                    props.reminder.type == "Doctor"
                    ? styles.yellowBackground 
                    : props.reminder.type == "Stuff"
                    ? styles.pinkBackground
                    : styles.greenBackground
                ]}
            >
                <View
                    style={styles.eventTitle}
                >
                    <Image
                        source={imgSource}
                    />
                    <Text
                        style={{
                            fontFamily: 'RedHatText-Bold',
                            fontSize: 16,
                            marginLeft: 8,
                        }}
                    >
                        {props.reminder.title}
                    </Text>

                    <Text
                        style={{
                            fontFamily: 'RedHatText-Regular',
                            position: 'absolute',
                            right: 0,
                            top: 4,
                            fontSize: 12,
                        }}
                    >
                        {moment(props.reminder.datetime).fromNow()}
                    </Text>
                </View>

                <PetsName
                    pets={props.reminder.pets}
                />

                <View
                    style={styles.eventTime}
                >
                    <Image
                        style={{
                            marginRight: 4,
                        }}
                        source={require('../assets/icons/Clock.png')}
                    />

                    <Text>
                        {moment(props.reminder.datetime).format("HH:mm")}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const renderFooter = useCallback(props => (
        <BottomSheetFooter 
            {...props} 
            bottomInset={10}
        >
            <View style={styles.footerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image
                        source={require('../assets/icons/BackArrow.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('AddScheduleScreen')
                    }}
                >
                    <Image
                        source={require('../assets/icons/Add.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                        source={require('../assets/icons/Settings.png')}
                    />
                </TouchableOpacity>
            </View>
        </BottomSheetFooter>
    ),[])

    const handleSheetChanges = useCallback(index => {
        setState(index)
    }, [])
    
    return (
        <View
            style={styles.container}
        >
            {
                state == 0
                ?
                <CalendarList
                    horizontal={true}
                    pagingEnabled={true}
                    markedDates={monthData}
                    theme={{
                        calendarBackground: COLORS.dark,
                        textSectionTitleColor: '#E5E5E5',
                        selectedDayBackgroundColor: '#E21717',
                        selectedDayTextColor: '#E5E5E5',
                        dotColor: '#ff0000',
                        todayTextColor: '#ff0000',
                        dayTextColor: '#E5E5E5',
                        monthTextColor: '#E5E5E5'
                    }}
                    onDayPress={date => {
                        console.log(date);
                        setSelectedDate(new Date(date.dateString))
                    }}
                />
                :
                <CalendarStrip
                    style={{height:150, paddingTop: 20}}
                    daySelectionAnimation={{
                        type: 'background', 
                        duration: 200,
                        highlightColor: COLORS.white,
                    }}
                    calendarColor={COLORS.dark}
                    calendarHeaderStyle={{color: COLORS.white}}
                    dateNumberStyle={{color: COLORS.white}}
                    highlightDateNumberStyle={{color: COLORS.dark}}
                    dateNameStyle={{color: COLORS.white, fontSize: 12}}
                    highlightDateNameStyle={{color: COLORS.dark}}
                    iconContainer={{flex: 0.1}}
                    calendarAnimation={{
                        type: 'sequence',
                        duration: 100,
                    }}
                    onDateSelected={date => {
                        setSelectedDate(new Date(date))
                    }}
                    selectedDate={selectedDate}
                />
                
            }
            <BottomSheet
                useRef={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                footerComponent={renderFooter}
                onChange={handleSheetChanges}
            >
                <View style={styles.contentContainer}>
                    <Text
                       style={{
                            alignSelf: 'center',
                            fontSize: 20,
                    }} 
                    >
                        Ngày {moment(selectedDate).format('DD MMMM')}
                    </Text>
                    <ScrollView>
                        <Text
                            style={{
                                fontSize: 18,
                                marginLeft: 20,
                            }}
                        >Sắp tới
                        </Text>
                        {
                            reminderList.length <= 0 
                            ? 
                            <Text
                                style={{
                                    marginTop: 4,
                                    fontFamily: 'Roboto-Italic',
                                    fontSize: 14,
                                    marginLeft: 30,
                                }}
                            >Không có dữ liệu
                            </Text> : null
                        }
                        
                        {
                            reminderList.map(reminder => {
                                return (
                                    <CalendarEvent
                                        key={reminder._id}
                                        reminder={reminder}
                                    />
                                )
                            })
                        }

                        <Text
                            style={{
                                marginTop: 20,
                                fontSize: 18,
                                marginLeft: 20,
                            }}
                        >Đã qua
                        </Text>
                        {
                            oldReminderList.length <= 0 
                            ?
                            <Text
                                style={{
                                    marginTop: 4,
                                    fontFamily: 'Roboto-Italic',
                                    fontSize: 14,
                                    marginLeft: 30,
                                }}
                                >Không có dữ liệu
                            </Text> : null
                        }

                        {
                            oldReminderList.map(reminder => {
                                return (
                                    <CalendarEvent
                                        key={reminder._id}
                                        reminder={reminder}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                    
                </View>
            </BottomSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242B2E',
    },
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    eventContainer: {
        position: 'relative',
        width: '90%',
        alignSelf: 'center',
        height: 100,
        borderRadius: 15,
        padding: 12,
        marginTop: 12,
    },
    yellowBackground: {
        backgroundColor: COLORS.yellow,
    },
    greenBackground: {
        backgroundColor: COLORS.green,
    },
    pinkBackground: {
        backgroundColor: COLORS.pink,
    },
    eventTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    petsContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 16,
        bottom: 12,
        left: 12,
    },
    petName: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
        marginRight: 4,
    },
    eventTime: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    navBar: {
        position: 'absolute',
        bottom: 0, 
    },
    footerContainer: {
        width: '60%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center'
    },
})


