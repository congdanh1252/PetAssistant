import React, { useEffect, useState }  from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'

import COLORS from '../theme/colors';
import strings from '../data/strings';
import { getPredictList } from '../api/HeathPredictAPI'

import { TouchableOpacity } from 'react-native-gesture-handler';

const Section = (props) => {
    return (
        <View style={styles.sectionContainer}>
            <View
                style={{
                    marginRight: 20,
                }}
            >
                <Text style={styles.sectionTitle}>
                    {props.predict.title}
                </Text>

                <Text style={styles.sectionDescription}>
                    {props.predict.description}
                </Text>


            </View>

            <TouchableOpacity 
                style={{
                }}
            >
                <Image
                    source={require('../assets/icons/Back.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

export function PredictScreen() {
    const [predictList, setPredictList] = useState([])

    useEffect(() => {
        let isCancelled = false;
        getPredictList(predictList => {
            try {
                if (!isCancelled) {
                    setPredictList(predictList)
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
                    predictList.map(predict => {
                        return (
                            <Section
                                key={predict._id}
                                predict={predict}
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
