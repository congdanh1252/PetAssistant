import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import AddPetScreen from './src/screens/AddPetScreen';
import { IntroductionScreen } from './src/screens/IntroductionScreen';
import { MyPetsScreen } from './src/screens/MyPetsScreen';
// import { PetProfileScreen } from './src/screens/PetProfileScreen';

export default function App() {
  return (
    <MyPetsScreen/>
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