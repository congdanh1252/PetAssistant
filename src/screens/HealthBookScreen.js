import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, TouchableHighlight,
} from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { WelcomeScreen } from './WelcomeScreen';
import { IntroductionScreen } from './IntroductionScreen';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';

const Tab = createMaterialTopTabNavigator();

const MyTabs = () => {
    return (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22
            },
            tabBarLabelStyle: {
              fontSize: 16,
              fontFamily: 'Roboto-Medium',
              textTransform: 'none',
            },
            tabBarActiveTintColor: COLORS.black,
            tabBarIndicatorStyle: {
              backgroundColor: COLORS.black
            }
          }}
        >
          <Tab.Screen name={strings.vaccination_label} component={WelcomeScreen} />
          <Tab.Screen name={strings.treatment_label} component={IntroductionScreen} />
        </Tab.Navigator>
    );
}

const HealthBookScreen = ({route, navigation}) => {
    const { pet_id } = route.params;

    return (
        <View style={style.screen}>
            <View style={style.header}>
                <BackButton
                    container={'trans'}
                    navigation={navigation}
                />

                <Text style={style.headerTitle}>{strings.health_book}</Text>
            </View>

            <View style={style.container}>
                <MyTabs/>
            </View>
        </View>
    )
}

export default HealthBookScreen;

const style = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        height: '100%',
        // paddingTop: 22,
        // paddingLeft: 22,
        // paddingRight: 22,
        // paddingBottom: 22,
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    header: {
        width: '100%',
        height: 100,
        paddingTop: 12,
        paddingLeft: 8,
        flexDirection: 'row',
        backgroundColor: COLORS.dark,
    },
    headerTitle: {
        width: '76%',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 22,
        marginTop: 16,
        color: COLORS.white,
    },
});