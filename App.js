import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import AddPetScreen from './src/screens/AddPetScreen';
import { IntroductionScreen } from './src/screens/IntroductionScreen';
import { MyPetsScreen } from './src/screens/MyPetsScreen';
import MainStack from './src/navigations/MainStack';
// import { PetProfileScreen } from './src/screens/PetProfileScreen';

export default function App() {
  return (
    <MainStack/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});