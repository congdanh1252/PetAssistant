import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { IntroductionScreen } from './src/screens/IntroductionScreen';

export default function App() {
  return (
    <IntroductionScreen/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});