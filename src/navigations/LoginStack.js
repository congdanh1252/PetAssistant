import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { 
    ChangePasswordScreen,
} from '../screens/ChangePasswordScreen/ChangePasswordScreen';

import MainStack from '../navigations/MainStack'

const Stack = createNativeStackNavigator();

const ExpenditureStack = () => {
  return (
    <>
      <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              animation: 'slide_from_right'
            }}
          >
              <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
              <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{headerShown: false}}/>
              <Stack.Screen name="MainStack" component={MainStack} options={{headerShown: false}}/>
          </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default ExpenditureStack;