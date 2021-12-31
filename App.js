import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message';
import MainStack from './src/navigations/MainStack';
import LoginStack from './src/navigations/LoginStack';
import ProfileScreen from './src/screens/ProfileScreen';
import PredictScreen from './src/screens/PredictScreen';
import SettingScreen from './src/screens/SettingScreen';

export default function App() {
  return (
    <>
      <LoginStack />
      <Toast />
    </>
  );
}