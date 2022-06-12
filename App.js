import React from "react"
import Toast from "react-native-toast-message"
import LoginStack from "./src/navigations/LoginStack"

export default function App() {
  return (
    <>
      <LoginStack />
      <Toast />
    </>
  )
}
