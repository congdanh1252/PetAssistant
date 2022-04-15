import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ProductScreen } from "../screens/ProductScreen"
import { ProductDetailScreen } from "../screens/ProductDetailScreen"
import SellPetScreen from '../screens/SellPetScreen'

const Stack = createNativeStackNavigator()

const ProductStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SellPet"
        component={SellPetScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

export default ProductStack
