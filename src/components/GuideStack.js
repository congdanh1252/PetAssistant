import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GuideListScreen from '../screens/GuideListScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';
import SavedGuideListScreen from '../screens/SavedGuideListScreen';

const Stack = createNativeStackNavigator();

const GuideStack = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="GuideList" component={GuideListScreen} options={{headerShown: false}}/>
        <Stack.Screen name="GuideDetail" component={GuideDetailScreen} options={{headerShown: false}}/>
        <Stack.Screen name="SavedList" component={SavedGuideListScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}

export default GuideStack;