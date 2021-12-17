import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import AddPetScreen from './src/screens/AddPetScreen';
import { IntroductionScreen } from './src/screens/IntroductionScreen';
import { MyPetsScreen } from './src/screens/MyPetsScreen';
import { StatisticScreen } from './src/screens/StatisticScreen';
import { ExpenditureScreen } from './src/screens/ExpenditureScreen';
import { Schedules } from './src/screens/Schedules';
import { ScheduleEvent } from './src/screens/ScheduleEvent';
import { PredictScreen } from './src/screens/PredictScreen';
import { PredictDetailsScreen } from './src/screens/PredictDetailsScreen';


import MainStack from './src/navigations/MainStack';
// import { PetProfileScreen } from './src/screens/PetProfileScreen';

export default function App() {
  return (
    <PredictDetailsScreen  />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});