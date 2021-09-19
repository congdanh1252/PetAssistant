import React from "react";
import COLORS from '../theme/colors'
import { StyleSheet, Text, View } from 'react-native'

const ProgressBar = (props) => {
    var dotLoop=[];
    for (let i = 0; i < props.num; i++) {
        dotLoop.push(
            <View
                key={i}
            >
                {(() => {
                    if (i == props.activeIndex){
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
        marginTop: 50,
        display: 'flex',
        flexDirection: 'row',
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