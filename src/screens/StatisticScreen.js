import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, Button } from 'react-native'
import COLORS from '../theme/colors'
import { windowHeight, windowWidth } from '../models/common/Dimensions'
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import Dialog from "react-native-dialog";
import Animated,
{
    AnimatedComponent,
    FadeInRight,
    useSharedValue, 
    useAnimatedStyle,  
    withSpring,
    FadeOutRight, 
} from 'react-native-reanimated';

import strings from '../data/strings';
import Expenditure from '../models/expenditure';
import { 
    getExpenditures, 
    getAllDate, 
    getMonthTotal,
    findDateByKeyword, 
    getMonthLimitAndAvg
} from '../api/ExpenditureAPI';

import {
    WaitIcon,
    DoctorIcon,
    FoodIcon,
    StuffIcon, 
} from '../assets/icons/index'

export function StatisticScreen() {
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [datesList, setDatesList] = useState([])
    
    const SearchBar = () => {
        const [searchKeyword, setSearchKeyword] = useState("")
        const [showDatePicker, setShowDatePicker] = useState(false)
        const onFinishPicker = (event, selectedDate) => {
            const currentDate = selectedDate || selectedMonth;
            setShowDatePicker(false)
            console.log(currentDate)
        }
        return (
            <View style={styles.searchBar}>
                <View style={styles.inputBox}>
                    <TextInput
                        value={searchKeyword}
                        onChangeText={value => {
                            setSearchKeyword(value)
                        }}
                        style={styles.input}
                        placeholder={strings.findInfomation}
                        placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                    >
                    </TextInput>
                </View>
                <View style={styles.inputBox}>
                    <TouchableOpacity
                        onPress={() => {
                            getDateByKeyword(searchKeyword)
                        }}
                    >
                        <Image
                            style={{
                                width: 24,
                                height: 24,
                            }}
                            source={require('../assets/icons/Search.png')}
                        />
                    </TouchableOpacity>
                </View>
                {
                    // showDatePicker
                    // ? 
                    // <DateTimePicker 
                    //     value={selectedMonth}
                    //     mode='date'
                    //     is24Hour={true}
                    //     display="default"
                    //     onChange={onFinishPicker}
                    // />
                    // : null
                }
            </View>
        )
    }
    
    const renderHeaderCard = () => {
        const [monthLimit, setMonthLimit] = useState(0);
        const [monthSpent, setMonthSpent] = useState(0)
        const [monthAverage, setMonthAverage] = useState(0);

        const handleTotalCallback = (Total) => {
            setMonthSpent(Total)
        }

        const handleMonthLimitAvgCallback = (Limit, avg) => {
            setMonthLimit(Limit)
            setMonthAverage(avg)
        }

        useEffect(() => {
            const total = getMonthTotal(selectedMonth, handleTotalCallback)
            return () => {
                total
            }
        }, [])

        useEffect(() => {
            const limitNavg = getMonthLimitAndAvg(handleMonthLimitAvgCallback)
            return () => {
                limitNavg
            }
        }, [])
    
        return (
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <View style={styles.cardHeader}
                >
                    <Text style={styles.cardTextBold}>
                        {monthLimit / 1000}k
                    </Text>
                    <Text>
                        Hạn mức
                    </Text>
                </View>

                <View style={styles.cardHeader}
                >
                    <Text 
                        style={monthSpent < monthLimit ? styles.successText : styles.errorText}                    
                    >
                        {monthSpent / 1000}k
                    </Text>
                    <Text>
                        Tổng chi
                    </Text>
                </View>

                <View style={styles.cardHeader}
                >
                    <Text 
                        style={monthAverage > monthSpent ? styles.successText : styles.errorText}                    
                    >
                        {
                        monthAverage > 0 
                        ? monthAverage / 1000 + "k"
                        : monthAverage == 0 
                        ? monthAverage / 1000 + "k"
                        : monthAverage / 1000 + "k"
                        }
                    </Text>

                    <Text>
                        Trung bình
                    </Text>
                </View>

            </View>
        )
    }

    const SubDetails = (props) => {
        var imgSource = WaitIcon;
        switch (props.expenditure.type) {
            case 'food':
                imgSource = FoodIcon
                break;
            case 'stuff':
                imgSource = StuffIcon
                break;
            case 'doctor': 
                imgSource = DoctorIcon
                break
            default:
                imgSource = WaitIcon;
                break;
        }
        return (
            <View style={styles.subDetailsContainer}>
                <View
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                    }}
                >
                    <Image
                        style={{
                            marginRight: 20,
                        }}
                        source={imgSource}
                    />
                    <Text>
                        {props.expenditure.title}
                    </Text>
                    <Text
                        style={{
                            position: 'absolute',
                            right: 20,
                        }}
                    >
                        {props.expenditure.amount} vnd
                    </Text>
                </View>
                
            </View>
        )
    }

    const Details = (props) => {
        const date = new Date(selectedMonth)
        date.setDate(props.date)
        const [isOpen, setIsOpen] = useState(false)
        const [expenditureList, setExpenditureList] = useState([])
        const [total, setTotal] = useState(0)

        const rotation = useSharedValue(0)
        const animatedStyle = useAnimatedStyle(() => {
            return {
              transform: [{ rotateZ: `${rotation.value}deg` }],
            };
        });

        useEffect(() => {
            let isCancelled = false;
            getExpenditures(date, (ExpenditureList) => {
                try {
                    if (!isCancelled) {
                        var total = 0;
                        ExpenditureList.forEach(expenditure => {
                            total += expenditure.amount
                        });
                        setTotal(total)
                        setExpenditureList(ExpenditureList)
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
            <View style={{
            backgroundColor: COLORS.grey,
            borderRadius: 15,
            marginBottom: 10,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 10,
            }}>
                <View style={styles.detailContainer}>
                    {/* Date */}
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 36,
                        }}>
                            {moment(date).format('DD')}
                        </Text>
                        <View>
                            <Text style={{
                                fontSize: 12,
                                textAlign: 'right'
                            }}>
                            {moment(date).format('dddd')}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                textAlign: 'right'
                            }}>
                            {moment(date).format('/MM/YYYY')}
                            </Text>
                        </View>
                    </View>
                    
                    {/* Total and details button */}
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto-Bold',
                                fontSize: 24,
                                color: COLORS.success,
                            }}
                        >
                        {total}
                        </Text>

                        <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 14,
                            color: COLORS.success,
                        }}
                        >
                            {" "}VND
                        </Text>

                        <Animated.View
                            style={animatedStyle}
                        >
                            <TouchableOpacity 
                                style={{
                                    padding: 5,
                                }}
                                onPress={() => {
                                    setIsOpen(!isOpen)
                                    isOpen
                                    ?
                                    rotation.value = withSpring(0)
                                    :   
                                    rotation.value = withSpring(-90)
                                }}
                            >
                                <Image
                                    source={require('../assets/icons/Back_black.png')}
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
                
                {/* Sub-details */}
                {
                    isOpen
                    ? 
                    expenditureList.map(expenditure => {
                        return (
                            <SubDetails
                                key={expenditure._id}
                                expenditure={expenditure}
                            />
                        )
                    })
                    : null
                }
            </View>
        )
    }

    const handleDatesCallback = (DatesList) => {
        setDatesList(DatesList)
    }

    useEffect(() => {
        const unsubscribe = getAllDate(selectedMonth, handleDatesCallback)
        return () => {
            unsubscribe
        }
    }, [])

    const BottomBar = () => {
        const [isShowDialog, setIsShowDialog] = useState(false)
        const [isShowDatePicker, setIsShowDatePicker] = useState(false)
        const [expenditure, setExpenditure] = useState(new Expenditure())
        const handleCancel = () => {
            setIsShowDialog(false)
        }
        const handleDelete = () => {
            setIsShowDialog(false)
        }
        const onFinishDatePicker = (event, selectedDate) => {
            const currentDate = selectedDate || expenditure.date
            expenditure.date = currentDate
            setIsShowDatePicker(false)
        }
        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity
                >
                    <Image 
                        style={{
                        height: 30,
                        width: 30,
                        }}
                        source={require('../assets/icons/BackArrow.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsShowDialog(true)}
                >
                    <Image 
                        source={require('../assets/icons/Add.png')}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image 
                        style={{
                            height: 30,
                            width: 30,
                            }}
                        source={require('../assets/icons/Chart.png')}/>
                </TouchableOpacity>

                {/* Dialog */}
                <Dialog.Container
                    visible={isShowDialog}
                >
                    <Dialog.Title
                        style={{
                            fontFamily: 'Roboto-Bold'
                        }}
                    >
                        {strings.addExpenditure}
                    </Dialog.Title>
                    <Dialog.Description
                            style={{
                                fontFamily: 'Roboto-Medium',
                                fontSize: 14,
                            }}
                        >
                            {strings.addExpenditureInformation}
                    </Dialog.Description>
                    {/* Title */}
                    <Text
                        style={{
                            fontFamily: 'Roboto-Medium',
                            fontSize: 14,
                        }}
                    >
                        {strings.title}
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            onChangeText={value => {
                                setDialogInput(value)
                            }}
                            style={styles.input}
                            placeholder='Mua đồ ăn'
                            placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                        >
                        </TextInput>
                    </View>
                    {/* Date */}
                    <Text
                        style={{
                            fontFamily: 'Roboto-Medium',
                            fontSize: 14,
                        }}
                    >
                        {strings.date}
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            onEndEditing={event => {
                                var date = moment(event.nativeEvent.text, 'DD/MM/YYYY')
                                if (date.isValid())
                                    expenditure.date = date
                            }}
                            onFocus={() => {
                                setIsShowDatePicker(true)
                            }}
                            style={styles.input}
                            placeholder={moment(expenditure.date).format('DD/MM/YYYY')}
                            placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                        >
                        </TextInput>
                    </View>
                    {/* Type */}
                    <Text
                        style={{
                            fontFamily: 'Roboto-Medium',
                            fontSize: 14,
                        }}
                    >
                        {strings.type}
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            onEndEditing={event => {
                                expenditure.type = moment(event.nativeEvent.text)
                            }}
                            onChangeText={value => {
                                setDialogInput(value)
                            }}
                            style={styles.input}
                            placeholder='ABCDEF'
                            placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                        >
                        </TextInput>
                    </View>
                    {/* Amount */}
                    <Text
                        style={{
                            fontFamily: 'Roboto-Medium',
                            fontSize: 14,
                        }}
                    >
                        {strings.amount} (VNĐ)
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            keyboardType='numeric'
                            onEndEditing={event => {
                                expenditure.amount = moment(event.nativeEvent.text)
                            }}
                            style={styles.input}
                            placeholder='10000'
                            placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                        >
                        </TextInput>
                    </View>
                        
                    <Dialog.Button 
                        label={strings.cancel}
                        onPress={handleCancel}    
                    />
                    <Dialog.Button 
                        label={strings.add}
                        onPress={handleDelete}/>
                </Dialog.Container>

                {
                    isShowDatePicker
                    ? 
                    <DateTimePicker 
                        value={expenditure.date}
                        mode='date'
                        is24Hour={true}
                        display="default"
                        onChange={onFinishDatePicker}
                    />
                    : null
                }
            </View>
        )
    }

    const getDateByKeyword = (Keyword) => {
        console.log("Start finding: " + Keyword)
        findDateByKeyword(Keyword, handleDatesCallback)
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.headerTitle}>
                        {moment(selectedMonth).format('MMMM - YYYY')}
                    </Text>
                </View>
                {renderHeaderCard()}
            </View>

            {/* Body */}
            <View style={styles.bodyContainer}>
                <SearchBar />
                {/* Details */}
                {
                    datesList.length > 0
                    ?
                    <ScrollView

                    >
                        {
                            datesList.map(day => {
                                return (
                                    <Animated.View

                                        key={day}
                                        entering={FadeInRight.duration(1000)}
                                        exiting={FadeOutRight.duration(1000)}
                                    >
                                        <Details
                                            date={day}
                                        />
                                    </Animated.View>
                                    
                                )
                            })
                        }
                    </ScrollView>
                    : 
                    <Text
                        style={{
                            fontFamily: 'Roboto-MediumItalic',
                            alignSelf: 'center'
                        }}
                    >
                        {strings.cannotFindExpenditure}
                    </Text>
                }

                
            </View>

            {/* Footer */}
            <BottomBar />
                        

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
        padding: 24,
    },
    headerTitle: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        fontSize: 24,
        color: COLORS.white,
        marginBottom: 16,
    },
    cardHeader: {
        height: 65,
        width: 100,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTextBold: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
    },
    successText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        color: COLORS.success,
    },
    errorText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        color: COLORS.error,
    },
    bodyContainer: {
        padding: 20,
        flex: 7.5,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    searchBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },  
    input: {
        width: windowWidth - windowWidth / 4,
        height: 50,
        color: "#000",
        backgroundColor: '#EEEEEE',
        borderRadius: 15,
        padding: 15,
    },
    inputBox: {
        padding: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    calenderContainer: {
        width: 50,
        color: "#000",
        padding: 10,
    }, 
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subDetailsContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        paddingVertical: 10,
        paddingHorizontal: 30,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }, 
})
