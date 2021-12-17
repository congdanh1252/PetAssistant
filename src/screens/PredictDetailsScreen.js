import React, { useEffect, useState }  from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'

import COLORS from '../theme/colors';
import strings from '../data/strings';
import HeathPredict from '../models/heathPredict';
import { getPredictDetail, getPredictList } from '../api/HeathPredictAPI'

import { TouchableOpacity } from 'react-native-gesture-handler';
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
            <Text>
                {detail.title}
            </Text>
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
        <View>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <Text>
                    Chuẩn đoán
                </Text>

                <Text>
                    {props.detail.predict}
                </Text>

            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <Text>
                    Gợi ý
                </Text>

                <Text>
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
                <Text style={styles.title}>
                    {strings.predictHeath}
                </Text>
                <TouchableOpacity style={styles.headerIcon}>
                    <Image source={require('../assets/icons/QuestionMark.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles.bodyContainer}>
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
        flex: 1.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bodyContainer: {
        flex: 8.8,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 28, 
    },
    title: {
        fontFamily: 'Roboto-Bold',
        fontSize: 24,
        color: COLORS.white,
    },  
    headerIcon: {
        top: 0,
        left: 0,
    },
    sectionContainer: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.grey,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        //color: COLORS.white,
    },
    sectionDescription: {
        fontFamily: 'Roboto-Light',
        fontSize: 14,
        //color: COLORS.white,
    }
})
