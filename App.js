import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { IntroductionScreen } from './src/screens/IntroductionScreen';
import { ScheduleEvent } from './src/screens/ScheduleEvent'
import { Schedules } from './src/screens/Schedules'
import Toast from 'react-native-toast-message';
export default function App() {
  return (
    <>
      <ScheduleEvent />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>    
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