import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native'
import { TextInput, TouchableOpacity  } from 'react-native-gesture-handler';
import { MaterialIcons } from 'react-native-vector-icons'; 

import COLORS from '../../theme/colors';
import ProgressBar from '../../components/ProgressBar'
import Questions from '../../data/Questions'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const ChangePasswordScreen_3_2 = () => {
    const questionData = Questions;
    const [questionNum, setQuestionNum] = useState(0);

    const renderQuestion = () => {
        return (
            <View style={styles.inputBox}>
                <Text style={styles.question}>

                    {questionNum + 1 + ". " + questionData[questionNum]?.question}
                </Text>
                <TextInput style={styles.input}
                    placeholder={questionData[questionNum]?.placeholder}
                    placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
                />
            </View>
        )
    }

    return (
        <View 
            style={styles.container}
        >
            <Text
                style={styles.title}
            >
                JUST {"\n"}
                SIMPLE QUESTION
            </Text>
            <Text
                style={styles.sub__title}
            >
                Answer these question below
            </Text>

            {renderQuestion()}

            <TouchableOpacity
                onPress={() => {
                    questionNum == questionData.size - 1 
                    ? checkAnswer()
                    : setQuestionNum(questionNum + 1)
                }}
            >
                <MaterialIcons 
                    name="navigate-next" 
                    size={45} 
                    color="black"/>  
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center'
    },
    img: {
        height: 100,
        width: 100,
        marginBottom: 20,
    },
    title: {
        fontFamily: 'RedHatText-Bold',
        fontSize: 25,
        alignSelf: 'flex-start',
        marginBottom: 15,
        marginLeft: 25,
    },
    sub__title: {
        fontFamily: 'RedHatText',
        fontSize: 15,
        alignSelf: 'flex-start',
        marginBottom: 25,
        marginLeft: 25,
    },
    inputBox: {
        alignItems: 'center',
        marginBottom: 20,
    },
    question: {
        marginTop: 16,
        marginBottom: 20,
        fontFamily: 'RedHatText-Bold',
        fontSize: 16,
    },
    input: {
        width: windowWidth - windowWidth / 3,
        color: "#000",
        backgroundColor: COLORS.grey,
        textAlign: 'center',
        borderRadius: 15,
        padding: 10,
    }
})