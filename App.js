import React from "react"
import Toast from "react-native-toast-message"
import MainStack from "./src/navigations/MainStack"
import LoginStack from "./src/navigations/LoginStack"
import { ProductScreen } from "./src/screens/ProductScreen"
import { PetNurseryScreen } from "./src/screens/PetNurseryScreen"
import { PetNurseryDetailScreen } from "./src/screens/PetNurseryDetailScreen"

export default function App() {
  return (
    <>
      <ProductScreen />
      <Toast />
    </>
  )
}
