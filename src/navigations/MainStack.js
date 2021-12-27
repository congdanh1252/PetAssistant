import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PetStack from './PetStack';
import GuideStack from './GuideStack';
import SearchingScreen from '../screens/SearchingScreen';
import ScheduleStack from '../navigations/ScheduleStack';
import ExpenditureStack from '../navigations/ExpenditureStack';
import PredictStack from '../navigations/PredictStack';
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
          <Stack.Screen name="MyPets" component={PetStack} options={{headerShown: false}}/>
          <Stack.Screen name="Guides" component={GuideStack} options={{headerShown: false}}/>
          <Stack.Screen name="Searching" component={SearchingScreen} options={{headerShown: false}}/>
          <Stack.Screen name="ScheduleStack" component={ScheduleStack} options={{headerShown: false}}/>
          <Stack.Screen name="ExpenditureStack" component={ExpenditureStack} options={{headerShown: false}}/>
          <Stack.Screen name="PredictStack" component={PredictStack} options={{headerShown: false}}/>
          <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Setting" component={SettingScreen} options={{headerShown: false}}/>
      
      </Stack.Navigator>
      <Toast/>
    </>
  );
}

export default MainStack;