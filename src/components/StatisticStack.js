import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatisticScreen } from '../screens/StatisticScreen';
import { ExpenditureScreen } from '../screens/ExpenditureScreen';

const Stack = createNativeStackNavigator();

const Home = () => {
    return (
        <View>
            <Text>
                Hello
            </Text>
        </View>
    )
}


const Noti = () => {
    return (
        <View>
            <Text>
                Hello
            </Text>
        </View>
    )
}


export function ExpenditureStack() {
  return (
    <NavigationContainer>
        <Stack.Navigator 
            screenOptions={{
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Noti" component={Noti}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}