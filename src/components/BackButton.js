import React from "react";
import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import COLORS from '../theme/colors'

const BackButton = (props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={
                props.container=='black' ?
                [styles.container] : [styles.container, {backgroundColor: 'transparent'}]
            }
            onPress={() => {
                props.navigation.goBack();
            }}
        >
            <Image source={require('../assets/icons/Back.png')} />
        </TouchableOpacity>
    )
}

export default BackButton;

const styles = StyleSheet.create({
    container: {
        height: 48,
        width: 48,
        backgroundColor: COLORS.black,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});