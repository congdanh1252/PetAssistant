import React, { useEffect, useState }  from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'

import COLORS from '../theme/colors';
import strings from '../data/strings';
import { getPredictList } from '../api/HeathPredictAPI'
import { TouchableOpacity } from 'react-native-gesture-handler';


export function PredictScreen({navigation}) {
    const [predictList, setPredictList] = useState([])

    useEffect(() => {
        let isCancelled = false;
        getPredictList(predictList => {
            try {
                if (!isCancelled) {
                    console.log(predictList);
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

    const Section = (props) => {
        return (
            <View style={styles.sectionContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('PredictDetail', {
                            predict_id: props.predict._id
                        })
                    }}
                >
                    <Text style={styles.sectionTitle}>
                        {props.predict.title}
                    </Text>
    
                    <Text style={styles.sectionDescription}>
                        {props.predict.description}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.headerIcon}
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image source={require('../assets/icons/Back.png')} />
                </TouchableOpacity>

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
        justifyContent: 'space-between'
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
    headerIcon: {
        padding: 8,
    },
    sectionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.grey,
        padding: 20,
        marginRight: -10,
        borderRadius: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
    },
    sectionDescription: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
    }
})
