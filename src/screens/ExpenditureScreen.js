import React, { useEffect, useState, useCallback  } from 'react'
import { View, Text, StyleSheet, TextInput, Image, Button } from 'react-native'
import COLORS from '../theme/colors'
import { windowHeight, windowWidth } from '../models/common/Dimensions'
import moment from 'moment';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MonthPicker from 'react-native-month-year-picker';

import { moneyFormat } from '../models/common/moneyStringFormat';
import { checkDateAfterToday } from '../models/common/validateFunctions';
import Dialog from "react-native-dialog";
import Animated,
{
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
    getMonthLimit,
    getMonthAverage,
    addExpenditure,
    updateExpenditure,
    deleteExpenditure,
} from '../api/ExpenditureAPI';
import {
    QuestionIcon,
    DoctorIcon,
    FoodIcon,
    StuffIcon, 
    PenIcon,
    ServiceIcon,
    SettingIcon,
} from '../assets/icons/index'

export function ExpenditureScreen({navigation}) {
    const [selectedMonth, setSelectedMonth] = useState(new Date())
    const [datesList, setDatesList] = useState([])

    const setMonthChange = (month) => {
        setSelectedMonth(month)
    }
    
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
                                width: 20,
                                height: 20,
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
    
    const Header = () => {
        const [monthLimit, setMonthLimit] = useState(0);
        const [monthSpent, setMonthSpent] = useState(0)
        const [monthAverage, setMonthAverage] = useState(0);
        const [show, setShow] = useState(false)
        const showPicker = useCallback((value) => setShow(value), []);

        const handleTotalCallback = (Total) => {
            setMonthSpent(Total)
        }

        const handleMonthLimitCallback = (Limit) => {
            setMonthLimit(Limit)
        }
        const handleMonthAvgCallback = (avg) => {
            setMonthAverage(avg)
        }

        const onMonthChange = useCallback(
            (event, newDate) => {
                const selectedDate = newDate || selectedMonth;
                showPicker(false);
                setMonthChange(selectedDate);
            },
            [selectedMonth, showPicker],
        );

        useEffect(() => {
            const total = getMonthTotal(selectedMonth, handleTotalCallback)
            return () => {
                total
            }
        }, [])

        useEffect(() => {
            const limit = getMonthLimit(handleMonthLimitCallback)
            return () => {
                limit
            }
        }, [])

        useEffect(() => {
            const avg = getMonthAverage(selectedMonth, handleMonthAvgCallback)
            return () => {
                avg
            }
        }, [])
    
        return (
            <View style={styles.headerContainer}>
                <View
                    style={{
                        position: 'relative'
                    }}
                >
                    <TouchableOpacity
                        onPress={()=>showPicker(true)}>
                        <Text style={styles.headerTitle}>
                            {moment(selectedMonth).format('MMMM - YYYY')}
                        </Text>
                    </TouchableOpacity>
                </View>

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
                    {show && (
                        <MonthPicker
                            onChange={onMonthChange}
                            value={selectedMonth}
                            locale="vi"
                        />
                    )}
                </View>
            </View>
        )
    }

    const SubDetails = (props) => {
        var imgSource = QuestionIcon;
        switch (props.expenditure.type) {
            case 'Food':
                imgSource = FoodIcon
                break;
            case 'Stuff':
                imgSource = StuffIcon
                break;
            case 'Doctor': 
                imgSource = DoctorIcon
                break
            case 'Service': 
                imgSource = ServiceIcon
                break
            default:
                imgSource = QuestionIcon;
                break;
        }
        const [isShowDialog, setIsShowDialog] = useState(false);
        const [isShowDatePicker, setIsShowDatePicker] = useState(false)
        const [expenditure, setExpenditure] = useState(props.expenditure)
        const [expenditureTitle, setExpenditureTitle] = useState(expenditure.title)
        const [expenditureAmount, setExpenditureAmount] = useState(expenditure.amount)
        const [selectedValue, setSelectedValue] = useState("Doctor")
        const handleCancel = () => {
            setIsShowDialog(false)
        }
        const handleUpdate = () => {
            if (checkDateAfterToday(expenditure.date)) {
                setIsShowDialog(false)
                expenditure.title = expenditureTitle
                expenditure.amount = expenditureAmount
                updateExpenditure(expenditure, () => {
                    setSelectedMonth(expenditure.date)
                    console.log("success");
                })
            } else {
                console.log("invalid");
            }
        }
        const handleDelete = () => {
            setIsShowDialog(false)
            deleteExpenditure(expenditure, () => {
                setSelectedMonth(expenditure.date)
                console.log("success");
            })
        }
        const onFinishDatePicker = (event, selectedDate) => {
            const currentDate = selectedDate || expenditure.date
            expenditure.date = currentDate
            setIsShowDatePicker(false)
        }
        return (
            <View style={styles.subDetailsContainer}>
                <View
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 10,
                    }}
                >
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Image
                            source={imgSource}
                        />
                        <Text
                            style={{
                                marginLeft: 10,
                            }}
                        >
                            {props.expenditure.title}
                        </Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text
                            style={{
                                marginRight: 10,
                            }}
                        >
                            {moneyFormat(props.expenditure.amount)} vnd
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setIsShowDialog(true)
                            }}
                        >
                            <Image
                                source={PenIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <Dialog.Container
                    visible={isShowDialog}
                >
                    <Dialog.Title
                        style={{
                            fontFamily: 'Roboto-Bold'
                        }}
                    >
                        {strings.editExpenditure}
                    </Dialog.Title>
                    {/* <Dialog.Description
                            style={{
                                fontFamily: 'Roboto-Medium',
                                fontSize: 14,
                            }}
                        >
                            {strings.addExpenditureInformation}
                    </Dialog.Description> */}
                    {/* Title */}
                    <Text
                        style={{
                            fontFamily: 'Roboto-Medium',
                            fontSize: 14,
                            marginBottom: 4,
                        }}
                    >
                        {strings.title}
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={expenditureTitle}
                            onChangeText={setExpenditureTitle}
                            maxLength={100}
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
                            marginBottom: 4,

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
                            placeholder={moment(props.expenditure.date).format('DD/MM/YYYY')}
                            placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                        >
                        </TextInput>
                    </View>
                    {/* Type */}
                    <Text
                        style={{
                            fontFamily: 'Roboto-Medium',
                            fontSize: 14,
                            marginBottom: 4,
                        }}
                    >
                        {strings.type}
                    </Text>
                    <Picker
                        selectedValue={props.expenditure.type}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedValue(itemValue)
                            expenditure.type = itemValue
                        }}>
                        <Picker.Item label="Sức khỏe" value="Doctor" />
                        <Picker.Item label="Dụng cụ" value="Stuff" />
                        <Picker.Item label="Dịch vụ" value="Service" />
                        <Picker.Item label="Thức ăn" value="Food" />
                        <Picker.Item label="Khác" value="Other" />
                    </Picker>
                    {/* Amount */}
                    <Text
                        style={{
                            fontFamily: 'Roboto-Medium',
                            fontSize: 14,
                            marginBottom: 4,
                        }}
                    >
                        {strings.amount} (VNĐ)
                    </Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={expenditureAmount.toString()}
                            keyboardType='numeric'
                            onChangeText={setExpenditureAmount}
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
                        label={strings.delete}
                        onPress={handleDelete}    
                    />
                    <Dialog.Button 
                        label={strings.save}
                        onPress={handleUpdate}
                    />
                    {
                        isShowDatePicker
                        ? 
                        <DateTimePicker 
                            value={expenditure.date}
                            mode='date'
                            is24Hour={true}
                            display="default"
                            onChange={onFinishDatePicker}
                            maximumDate={new Date()}
                        />
                        : null
                    }   
                </Dialog.Container> 
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
                            total += parseInt(expenditure.amount)
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
                        {moneyFormat(total)}
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
        console.log(DatesList)
        setDatesList(DatesList)
    }

    const BottomBar = () => {
        const [isShowDialog, setIsShowDialog] = useState(false);
        const [isShowDatePicker, setIsShowDatePicker] = useState(false)
        const [expenditure, setExpenditure] = useState(new Expenditure())
        const [expenditureAmount, setExpenditureAmount] = useState(expenditure.amount)
        const [selectedValue, setSelectedValue] = useState()
        const handleCancel = () => {
            setIsShowDialog(false)
        }
        const handelAdd = () => {
            expenditure.amount = expenditureAmount
            addExpenditure(expenditure, () => {
                setSelectedMonth(new Date(expenditure.date))
            })
        }
        const onFinishDatePicker = (event, selectedDate) => {
            const currentDate = selectedDate || expenditure.date
            expenditure.date = currentDate
            setIsShowDatePicker(false)
        }
        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
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
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Statistic')
                    }}
                >
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
                                expenditure.title = value
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
                            value={moment(expenditure.date).format('DD/MM/YYYY')}
                            onEndEditing={event => {
                                var date = moment(event.nativeEvent.text, 'DD/MM/YYYY')
                                if (date.isValid())
                                    expenditure.date = date
                            }}
                            onFocus={() => {
                                setIsShowDatePicker(true)
                            }}
                            style={styles.input}
                            //placeholder={}
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
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedValue(itemValue)
                            expenditure.type = itemValue
                        }}>
                        <Picker.Item label="Sức khỏe" value="Doctor" />
                        <Picker.Item label="Dụng cụ" value="Stuff" />
                        <Picker.Item label="Dịch vụ" value="Service" />
                        <Picker.Item label="Thức ăn" value="Food" />
                        <Picker.Item label="Khác" value="Other" />
                    </Picker>
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
                            onChangeText={setExpenditureAmount}
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
                        onPress={handelAdd}/>

                    {
                        isShowDatePicker
                        ? 
                        <DateTimePicker 
                            value={expenditure.date}
                            mode='date'
                            is24Hour={true}
                            display="default"
                            onChange={onFinishDatePicker}
                            maximumDate={new Date()}
                        />
                        : null
                    }   
                </Dialog.Container> 
            </View>
        )
    }

    const getDateByKeyword = (Keyword) => {
        findDateByKeyword(Keyword, selectedMonth, handleDatesCallback)
    } 

    useEffect(() => {
        let isCancelled = false;
        getAllDate(selectedMonth, datesList => {
            try {
                if (!isCancelled) {
                    setDatesList(datesList)
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
        <View style={styles.container}>
            {/* Header */}
            <Header />

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
                    : null
                    // <Text
                    //     style={{
                    //         fontFamily: 'Roboto-MediumItalic',
                    //         alignSelf: 'center'
                    //     }}
                    // >
                    //     {strings.cannotFindExpenditure}
                    // </Text>
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
        flex: 1.2, 
        padding: 24,
    },
    headerTitle: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        color: COLORS.white,
        marginBottom: 16,
    },
    cardHeader: {
        height: 50,
        width: 100,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTextBold: {
        fontFamily: 'Roboto-Bold',
        fontSize: 12,
    },
    successText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 12,
        color: COLORS.success,
    },
    errorText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        color: COLORS.error,
    },
    bodyContainer: {
        padding: 15,
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
        height: 40,
        color: "#000",
        backgroundColor: '#EEEEEE',
        borderRadius: 15,
        paddingHorizontal: 15,
    },
    inputBox: {
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
        display: 'flex',
        flex: 0.3,
        backgroundColor: COLORS.white,
        paddingVertical: 10,
        paddingBottom: 20,
        paddingHorizontal: 30,
        width: '100%',
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
