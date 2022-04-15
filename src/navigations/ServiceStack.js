import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ServiceScreen from '../screens/ServiceScreen';
import ServiceListScreen from '../screens/ServiceListScreen';
import CategoryItemProfileScreen from '../screens/CategoryItemProfileScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import SavedServiceListScreen from '../screens/SavedServiceListScreen';
import SellPetScreen from '../screens/SellPetScreen';
import AppointmentArchivedScreen from '../screens/AppointmentArchivedScreen';
import NurseryStack from './NurseryStack';
import ProductStack from './ProductStack';

const Stack = createNativeStackNavigator();

const ServiceStack = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="ServiceHome" component={ServiceScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ServiceList" component={ServiceListScreen} options={{headerShown: false}}/>
        <Stack.Screen name="CategoryItem" component={CategoryItemProfileScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ChatList" component={ChatListScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ProductStack" component={ProductStack} options={{headerShown: false}}/>
        {/* <Stack.Screen name="SellPet" component={SellPetScreen} options={{headerShown: false}}/> */}
        <Stack.Screen name="NurseryStack" component={NurseryStack} options={{headerShown: false}}/>
        <Stack.Screen name="AppointmentArchive" component={AppointmentArchivedScreen} options={{headerShown: false}}/>
        <Stack.Screen name="SavedServiceList" component={SavedServiceListScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}

export default ServiceStack;