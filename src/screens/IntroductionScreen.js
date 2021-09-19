import React, { useState } from 'react';
import COLORS from '../theme/colors'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-elements/dist/buttons/Button';
import ProgressBar from '../components/ProgressBar';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export function IntroductionScreen() {

    return (
        <View style={style.container}>
            <View style={style.card}>
                
            </View>

            <ProgressBar
                num={4}
                activeIndex={1}    
            />

            <Button
                type='solid' 
                containerStyle={{marginTop: 80}}
                titleStyle={{fontSize: 20}}
                buttonStyle={style.button} 
                title='Next'
            />
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        flex: 1,
        alignItems: 'center'
    },
    card: {
        marginTop: 80,
        backgroundColor: COLORS.white,
        height: windowHeight / 2,
        width: windowWidth - (windowWidth / 5),
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: COLORS.primaryDark,
        color: '#000',
        width: 130,
        height: 55,
        borderRadius: 10
    },
});