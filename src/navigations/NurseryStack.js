import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { PetNurseryScreen } from "../screens/PetNurseryScreen"
import { PetNurseryDetailScreen } from "../screens/PetNurseryDetailScreen"

const Stack = createNativeStackNavigator()

const NurseryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Nursery"
        component={PetNurseryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NurseryDetail"
        component={PetNurseryDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default NurseryStack
