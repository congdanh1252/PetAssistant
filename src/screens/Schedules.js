import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';
import { Agenda, Calendar, CalendarList } from 'react-native-calendars'
import {LocaleConfig} from 'react-native-calendars';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CalendarStrip from 'react-native-calendar-strip';

import COLORS from '../theme/colors';
import {windowHeight, windowWidth} from '../models/common/Dimensions'


LocaleConfig.locales['vi'] = {
  monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
  monthNamesShort: ['Tha.1','Tha.2','Tha.3','Tha.4','Tha.5','Tha.6','Tha.7','Tha.8','Tha.9','Tha.10','Tha.11','Tha.12'],
  dayNames: ['Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy','Chủ nhật'],
  dayNamesShort: ['T2','T3','T4','T5','T6','T7','CN'],
  today: 'Hôm nay'
};
LocaleConfig.defaultLocale = 'vi';

export function Schedules () {

    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['50%', '80%'], []);
    const [state, setState] = useState(0)

    const PetsName = (props) => {
        return (
            <View
                style={styles.petsContainer}
            >
                <View
                    style={styles.petName}
                >
                    <Text>
                        {props.pets[0]}
                    </Text>
                </View>
                <View
                    style={styles.petName}
                >
                    <Text>
                        {props.pets[1]}
                    </Text>
                </View>
                {
                    props.pets.length >= 2
                    ?
                    <View
                        style={styles.petName}
                    >
                        <Text>
                            {"+" + (props.pets.length - 2)}
                        </Text>
                    </View>
                    : 
                    null
                }
            </View>
        )
    }

    const CalendarEvent = (props) => {
        return (
            <TouchableOpacity
                style={styles.eventContainer}
            >
                <View
                    style={styles.eventTitle}
                >
                    <Image
                    
                        source={require('../assets/icons/vaccine.png')}
                    />
                    <Text
                        style={{
                            fontFamily: 'RedHatText-Bold',
                            fontSize: 16,
                            marginLeft: 8,
                        }}
                    >
                        {props.title}
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
                        {props.dueTime}
                    </Text>
                </View>

                <PetsName
                        pets={['Goofy', 'Oggy', 'Goofy', 'Oggy']}
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
                        {props.time}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const TimeLine = (props) => {
        return (
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <Text>
                    {props.time}
                </Text>
                <View
                    style={styles.lineStyle}
                >
                </View>
            </View>
        )
    }

    const renderFooter = useCallback(props => (
        <BottomSheetFooter 
            {...props} 
            bottomInset={10}
        >
            <View style={styles.footerContainer}>
                <TouchableOpacity>
                    <Image
                        source={require('../assets/icons/BackArrow.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
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
    }, []);

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
                    markedDates={{
                        '2021-10-07': {selected: true, marked: true,},
                        '2021-10-08': {marked: true,},
                    }}
                    theme={{
                        calendarBackground: COLORS.dark,
                        textSectionTitleColor: '#E5E5E5',
                        selectedDayBackgroundColor: '#c1c1c1',
                        dotColor: '#ff0000',
                        todayTextColor: '#ff0000',
                        dayTextColor: '#E5E5E5',
                        monthTextColor: '#E5E5E5'
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
                    markedDates={[
                        {
                            date: '10/7/2021',
                            dots: [
                              {
                                color: COLORS.white,
                                selectedColor: COLORS.dark,
                              },
                            ],
                        },
                    ]}
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
                            fontSize: 18,
                        }}
                    >Sắp tới
                    </Text>
                    <TimeLine
                        time="9:00"
                    />
                    {
                        // state == 0
                        // ?
                        // <View>
                        //     <CalendarEvent
                        //         title="Tiêm vaccine"
                        //         dueTime="45 phút"
                        //         time="05:00 - 06:00"
                        //     />

                        //     <CalendarEvent
                        //         title="Tắm"
                        //         dueTime="45 phút"
                        //         time="05:00 - 06:00"
                        //     />
                        // </View>
                        // :
 
                    }

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
        alignItems: 'center',
    },
    eventContainer: {
        position: 'relative',
        width: windowWidth - 40,
        height: 100,
        backgroundColor: COLORS.yellow,
        borderRadius: 15,
        padding: 12,
        marginTop: 12,
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
    lineStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 100,
    }
})


