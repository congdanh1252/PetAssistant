import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message';
import MainStack from './src/navigations/MainStack';

export default function App() {
  return (
    <>
      <MainStack  />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});