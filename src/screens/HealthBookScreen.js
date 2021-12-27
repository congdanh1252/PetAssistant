import React, { useState, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
    TouchableWithoutFeedback, TouchableHighlight,
} from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VaccinationScreen from './VaccinationScreen';
import TreatmentScreen from './TreatmentScreen';
import firestore from '@react-native-firebase/firestore';
import COLORS from '../theme/colors';
import strings from '../data/strings';
import BackButton from '../components/BackButton';

const Tab = createMaterialTopTabNavigator();

const MyTabs = (props) => {
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
          <Tab.Screen
            name={strings.vaccination_label}
            component={VaccinationScreen}
            initialParams={{
                pet_id: props.petId,
                pet_kind: props.petKind
            }}/>
          <Tab.Screen name={strings.treatment_label} component={TreatmentScreen} initialParams={{pet_id: props.petId}}/>
        </Tab.Navigator>
    );
}

const HealthBookScreen = ({route, navigation}) => {
    const { pet_id, pet_kind } = route.params;

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
                <MyTabs petId={pet_id} petKind={pet_kind}/>
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
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    header: {
        width: '100%',
        height: '12%',
        paddingTop: 10,
        paddingLeft: 8,
        flexDirection: 'row',
        backgroundColor: COLORS.dark,
    },
    headerTitle: {
        width: '77%',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 22,
        marginTop: 16,
        color: COLORS.white,
    },
});