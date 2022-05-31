import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/third-party/HomeScreen'
import ChatListScreen from '../screens/ChatListScreen'
import ChatScreen from '../screens/ChatScreen'
import ProfileScreen from '../screens/third-party/ProfileScreen'
import EditProfileScreen from '../screens/third-party/EditProfileScreen'
import AppointmentArchiveScreen from '../screens/third-party/AppointmentArchieveScreen'
import MakeAppointmentScreen from '../screens/MakeAppointmentScreen'

import ScheduleScreen from "../screens/third-party/ScheduleScreen"
import ScheduleEvent from "../screens/third-party/ScheduleEvent"
import ExpenditureScreen from "../screens/ExpenditureScreen"
import StatisticScreen from "../screens/StatisticScreen"
import FeedbackScreen from "../screens/FeedbackScreen"
import SettingScreen from "../screens/SettingScreen"

import Toast from "react-native-toast-message"


const Stack = createNativeStackNavigator();

const ThirdPartyMainStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyInformation"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScheduleEvent"
          component={ScheduleEvent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Expenditure"
          component={ExpenditureScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Statiscic"
          component={StatisticScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppointmentArchieve"
          component={AppointmentArchiveScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditAppointment"
          component={MakeAppointmentScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Toast />
    </>
  )
}

export default ThirdPartyMainStack
