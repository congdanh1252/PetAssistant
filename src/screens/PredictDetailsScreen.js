import React, { useEffect, useState }  from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'

import COLORS from '../theme/colors';
import strings from '../data/strings';
import HeathPredict from '../models/heathPredict';
import { getPredictDetail, getPredictList } from '../api/HeathPredictAPI'

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Animated,
{
    FadeInRight,
    useSharedValue, 
    useAnimatedStyle,  
    withSpring,
    FadeOutRight, 
} from 'react-native-reanimated';

const Section = (props) => {
    const [detail, setDetail] = useState(props.section)
    const [isOpen, setIsOpen] = useState(false)
    const rotation = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }],
        };
    });
    return (
        <View style={styles.sectionContainer}>
            <View
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                    <View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: props.section.color,
                                marginRight: 20,
                            }
                        ]}
                    >
                    </View>
                    <Text
                        style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: 18,
                        }}
                    >
                        {detail.title}
                    </Text>
                </View>
                
                
                <Animated.View
                    style={animatedStyle}
                >
                    <TouchableOpacity 
                        style={{
                            
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

            {/* Sub-details */}
            {
                isOpen
                ? 
                (
                    <SubDetail
                        key={detail.color}
                        detail={detail}
                    />
                )
                : null
            }
        </View>
    )
}

const SubDetail = (props) => {
    return (
        <View
            style={{
                width: '90%',
                justifyContent: 'center',
            }}
        >
            <View style={styles.sectionDetailContainer}>
                <Text
                    style={{
                        flex: 4,
                        fontFamily: 'Roboto-Light',
                        fontSize: 14,
                        alignItems: 'center',
                    }}
                >
                    Chuẩn đoán
                </Text>

                <Text
                    style={{
                        flex: 6,
                    }}
                >
                    {props.detail.predict}
                </Text>

            </View>

            <View style={styles.sectionDetailContainer}>
                <Text
                    style={{
                        flex: 4,
                        fontFamily: 'Roboto-Light',
                        fontSize: 14,
                    }}
                >
                    Gợi ý
                </Text>

                <Text 
                    style={{
                        flex: 6,
                    }}
                >
                    {props.detail.advice}
                </Text>

            </View>
        </View>
    )    
}

export function PredictDetailsScreen() {
    const [predict, setPredict] = useState(new HeathPredict())

    useEffect(() => {
        let isCancelled = false;
        getPredictDetail("GZi6kjzrEwuS1ej5jutm", predict => {
            try {
                if (!isCancelled) {
                    console.log(predict);
                    setPredict(predict)
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
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.headerIcon}>
                    <Image source={require('../assets/icons/Back.png')} />
                </TouchableOpacity>

                <Text style={styles.title}>
                    {strings.predictHeath} - {predict.title}
                </Text>

                <TouchableOpacity style={styles.headerIcon}>
                    <Image source={require('../assets/icons/QuestionMark.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles.bodyContainer}>
                <ScrollView>
                {
                    predict.predictDetail.map(section => {
                        return (
                            <Section
                                key={section.title}
                                section={section}
                            />
                        )
                    })
                }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242B2E',
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        justifyContent: 'space-between',
        flex: 1.2,
    },
    headerIcon: {
        padding: 8,
    },
    bodyContainer: {
        flex: 8.8,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 28, 
    },
    title: {
        alignSelf: 'center',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        color: COLORS.white,
    },  
    sectionContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.grey,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    dot: {
        backgroundColor: COLORS.green,
        width: 25,
        height: 25,
        borderRadius: 20,
    },
    sectionTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
    },
    sectionDescription: {
        fontFamily: 'Roboto-Light',
        fontSize: 14,
    },
    sectionDetailContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
    },
})
