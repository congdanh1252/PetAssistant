import React from "react";
import COLORS from '../theme/colors'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler";

const ProgressBar = (props) => {
    var dotLoop=[];
    for (let i = 0; i < props.num; i++) {
        dotLoop.push(
            <View
                // onPress={() => {
                //   props.onStateChange(i)
                // }}
                key={i}
            >
                {(() => {
                    if (i == props.activeIndex) {
                        return (
                            <View
                                style={styles.activeDot}
                            />
                        )
                    }   
                    return (
                        <View
                        style={styles.dot}
                        />
                    );
                })()}
            </View>
        );
    }
    return (
        <View
          style={styles.progressBar}
        >
        {dotLoop}
        </View>
    )
}

export default ProgressBar;

const styles = StyleSheet.create({
    dot: {
        backgroundColor: COLORS.dot,
        width: 32,
        height: 32,
        borderRadius: 16,
        marginLeft: 8, 
        marginRight: 8,
    },
    progressBar: {
        position: "absolute",
        display: 'flex',
        flexDirection: 'row',
        bottom: 25,
    },
    activeDot: {
        backgroundColor: COLORS.primaryDark,
        width: 32,
        height: 32,
        borderRadius: 16,
        marginLeft: 8, 
        marginRight: 8,
    }
});