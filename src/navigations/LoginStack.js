import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { 
    ChangePasswordScreen,
} from '../screens/ChangePasswordScreen/ChangePasswordScreen';
import { RegisterStack } from '../components/RegisterStack';

import MainStack from '../navigations/MainStack';
import ThirdPartyMainStack from './ThirdPartyMainStack';

const Stack = createNativeStackNavigator();

const LoginStack = () => {

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
              <Stack.Screen name="3rdMainStack" component={ThirdPartyMainStack} options={{headerShown: false}}/>
              <Stack.Screen name="RegisterStack" component={RegisterStack} options={{headerShown: false}}/>
          </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default LoginStack;