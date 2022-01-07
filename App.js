import React from 'react';
import Toast from 'react-native-toast-message';
import MainStack from './src/navigations/MainStack';
import LoginStack from './src/navigations/LoginStack';
import ProfileScreen from './src/screens/ProfileScreen';
import PredictScreen from './src/screens/PredictScreen';
import SettingScreen from './src/screens/SettingScreen';
import { RegisterStack } from './src/components/RegisterStack';

export default function App() {
  return (
    <>
      <LoginStack />
      <Toast />
    </>
  );
}