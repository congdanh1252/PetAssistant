import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { SocialIcon } from 'react-native-elements/dist/social/SocialIcon';
import { IntroductionScreen } from './src/screens/IntroductionScreen';
import { ChangePasswordScreen_4 } from './src/screens/ChangePasswordScreen_4';

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
