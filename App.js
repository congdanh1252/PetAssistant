import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message';
import MainStack from './src/navigations/MainStack';
import LoginStack from './src/navigations/LoginStack';

export default function App() {
  return (
    <>
      <LoginStack  />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});