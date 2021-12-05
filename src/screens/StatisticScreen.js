import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { color } from 'react-native-elements/dist/helpers';
import { PieChart } from 'react-native-svg-charts'
import moment from 'moment';

import COLORS from '../theme/colors'
import { moneyFormat } from '../models/common/moneyStringFormat';
import { getMonthStatistic } from '../api/ExpenditureAPI';
import strings from '../data/strings';
import {
    DoctorIcon,
    FoodIcon,
    StuffIcon, 
    HelpIcon,
    StoreIcon,
} from '../assets/icons/index'
import { TouchableOpacity } from 'react-native-gesture-handler';


export function StatisticScreen({navigation}) {
    const keys = ['Sức khỏe', 'Thức ăn', 'Dịch vụ', 'Dụng cụ', 'Khác'];
    const types = ['Doctor', 'Food', 'Service', 'Stuff', 'Other']
    const [percentage, setPercentage] = useState([20, 20, 20, 20, 20]);
    const [values, setValues] = useState([0, 0, 0, 0, 0]);
    const colors = [COLORS.yellow, COLORS.ocean, COLORS.green, COLORS.pink, COLORS.primaryDark]
    const [month, setMonth] = useState(new Date())

    useEffect(() => {
        let isCancelled = false
        getMonthStatistic(month, (values, percentage) => {
            try {
                if (!isCancelled) {
                    console.log(values)
                    console.log(percentage)
                    setPercentage(percentage)
                    setValues(values)
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

    const PieChar = () => {
        const [selectedSliceLabel, setSelectedSliceLabel] = useState('')
        const [selectedSliceValue, setSelectedSliceValue] = useState(0)
        const data = keys.map((key, index) => {
            return {
                key,
                value: percentage[index],
                svg: { fill: colors[index] },
                arc: { outerRadius: (70 + percentage[index]) + '%', padAngle: selectedSliceLabel === key ? 0.1 : 0 },
                onPress: () => {
                    setSelectedSliceLabel(key)
                    setSelectedSliceValue(percentage[index])
                }
            }
        })
        return (
            <View>
                <Text
                    style={{
                        fontFamily: 'Roboto-Medium',
                        textAlign: 'center',
                        fontSize: 16,
                        paddingBottom: 10,
                    }}>
                    {`${selectedSliceLabel} - ${selectedSliceValue}%`}
                </Text>
                <PieChart
                    style={{ height: 180, marginBottom: 20 }}
                    outerRadius={'80%'}
                    innerRadius={'30%'}
                    data={data}
                />
            </View>
        )
    }

    const TypeList = () => {
        return (
            <View
                style={styles.typeListContainer}
            >
                {keys.map((value, index) => {
                    const color = colors[index]
                    var imgSource = HelpIcon;
                    switch (types[index]) {
                        case 'Food':
                            imgSource = FoodIcon
                            break;
                        case 'Stuff':
                            imgSource = StuffIcon
                            break;
                        case 'Service': 
                            imgSource = StoreIcon
                            break;
                        case 'Doctor': 
                            imgSource = DoctorIcon
                            break
                        default:
                            imgSource = HelpIcon;
                            break;
                    }
                    return (
                        <View 
                            key={value}
                            style={{
                                width: '90%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 8,
                            }}
                        >
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    style={{
                                        height: 20,
                                        width: 20,
                                        marginRight: 8,
                                    }}
                                    source={imgSource}
                                />
                                <Text
                                    style={styles.detail}
                                >
                                    {value}
                                </Text>
                            </View>

                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={styles.detail}
                                >
                                    {moneyFormat(values[index]) + " vnđ"}
                                </Text>

                                <View
                                    style={{
                                        marginLeft: 16,
                                        backgroundColor: color,
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                    }}
                                >
                                </View>
                            </View>
                        </View>
                    )
                })}
            </View>
        )
    }

    const BottomBar = () => {
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
                >
                    <Image 
                        
                        style={{
                            height: 30,
                            width: 30,
                            }}
                        source={require('../assets/icons/Chart.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
         
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>
                    {strings.statistic}
                </Text>
                <Text
                    style={{
                        color: COLORS.white,
                        fontFamily: 'Roboto-Bold',
                        fontSize: 20,
                        alignSelf: 'center',
                    }}
                >
                    {moment(month).format('MMMM YYYY')}
                </Text>
            </View>

            {/* Body */}
            <View style={styles.bodyContainer}>
                <PieChar />

                <TypeList />
            </View>

            {/* Footer */}
            <BottomBar />
                        
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.dark,
    }, 
    headerContainer: {
        flex: 1,
        alignItems: 'center', 
        padding: 24,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: 'Roboto-Medium'
    },
    bodyContainer: {
        padding: 20,
        flex: 9,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    typeListContainer: {
        alignItems: 'center',
    },
    detail: {
        fontFamily: 'Roboto-Bold',
        fontSize: 12,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 30,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
