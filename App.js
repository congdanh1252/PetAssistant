import React from "react"
import Toast from "react-native-toast-message"
import MainStack from "./src/navigations/MainStack"
import LoginStack from "./src/navigations/LoginStack"
import SellPetScreen from "./src/screens/SellPetScreen"

export default function App() {
  return (
    <>
      <LoginStack />
      <Toast />
    </>
  )
}
