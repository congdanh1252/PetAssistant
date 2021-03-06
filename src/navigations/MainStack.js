import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import PetStack from './PetStack';
import GuideStack from './GuideStack';
import ScheduleStack from '../navigations/ScheduleStack';
import { ScheduleEvent } from '../screens/ScheduleEvent';
import ExpenditureStack from '../navigations/ExpenditureStack';
import PredictStack from '../navigations/PredictStack';
import ServiceStack from './ServiceStack';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';


import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <>
      <Stack.Navigator 
        screenOptions={{
          animation: 'slide_from_right'
        }}
      >
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Feedback" component={FeedbackScreen} options={{headerShown: false}}/>
          <Stack.Screen name="MyPets" component={PetStack} options={{headerShown: false}}/>
          <Stack.Screen name="Guides" component={GuideStack} options={{headerShown: false}}/>
          <Stack.Screen name="ScheduleStack" component={ScheduleStack} options={{headerShown: false}}/>
          <Stack.Screen name="ExpenditureStack" component={ExpenditureStack} options={{headerShown: false}}/>
          <Stack.Screen name="PredictStack" component={PredictStack} options={{headerShown: false}}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Setting" component={SettingScreen} options={{headerShown: false}}/>
          <Stack.Screen name="ScheduleEvent" component={ScheduleEvent} options={{headerShown: false}}/>
          <Stack.Screen name="Service" component={ServiceStack} options={{headerShown: false}}/>
      </Stack.Navigator>
      <Toast/>
    </>
  );
}

export default MainStack;