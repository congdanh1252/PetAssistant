import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  Pressable
} from 'react-native'

import { 
  MaterialIcons   
} from 'react-native-vector-icons';
import { Input } from 'react-native-elements/dist/input/Input';

import COLORS from '../../theme/colors';
import ProgressBar from '../../components/ProgressBar';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { 
  ChangePasswordScreen_1,
  ChangePasswordScreen_2,
  ChangePasswordScreen_3_1,
  ChangePasswordScreen_3_2,
  ChangePasswordScreen_4,
  ChangePasswordScreen_5,
} from './index';

import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import strings from '../../data/strings';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




export const ChangePasswordScreen = () => {
  const [currentState, setCurrentState] = useState(0);
  const [findMethod, setFindMethod] = useState('Email')
  const [method, setMethod] = useState(null);
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [name, setName] = useState()
  const [userImage, setUserImage] = useState()
  const [isReadyForNextState, setIsReadyForNextState] = useState(false)
  const [otp, setOTP] = useState()

  const sendEmailVertification = (email) => {
    console.log("send mail to: " + email);
    auth().sendPasswordResetEmail(email);
    setCurrentState(4)
  }

  const Buttons = (props) => {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          props.buttonName == 'Back' 
          ? setCurrentState(currentState - 1)
          : isReadyForNextState
          ? 
            currentState == 1 && method == 'email'
            ?  sendEmailVertification(email)
            : setCurrentState(currentState + 1)
          : null
          setIsReadyForNextState(false)
        }}
      >
      <Text
        style={{
          fontSize: 18,
          color: COLORS.white,
          fontFamily: 'RedHatText',
          fontWeight: '700',
        }}
        >
        {props.buttonName}
      </Text>
    </TouchableOpacity>
    )
  }

  return (
    <View
      style={styles.background}
    >
      <View
        style={styles.card}
      >
        {(() => {
          switch(currentState) {
            case 0: 
              return (
                <ChangePasswordScreen_1
                  findMethod={findMethod}
                  email={email}
                  phoneNum={phoneNumber}
                  name={name}
                  userImage={userImage}
                  onReady={value => {
                    setIsReadyForNextState(value)
                  }}
                  onGetEmail={value => {
                    setEmail(value)
                  }}
                  onGetPhoneNum={value => {
                    setPhoneNumber(value)
                  }}
                  onGetName={value => {
                    setName(value)
                  }}
                  onGetUserProfile={value => {
                    setUserImage(value)
                  }}
                />
              )
            case 1: 
              return (
                <ChangePasswordScreen_2
                  onReady={() => {
                    setIsReadyForNextState(true)
                  }}
                  phoneNumber={phoneNumber}
                  email={email}
                  onMethodChange={value => {
                    console.log('Finish 2')
                    setMethod(value);
                  }}
                />
              )
            case 2: 
              if (method == 'sms') {
                return (
                  <ChangePasswordScreen_3_1
                    phoneNumber={phoneNumber}  
                    onReady={() => {
                      setIsReadyForNextState(true)
                    }}
                  />
                )
              }
              return (
                <ChangePasswordScreen_3_2
                  onReady={() => {
                    setIsReadyForNextState(true)
                  }}
                />
              )
            case 3: 
              return (
                <ChangePasswordScreen_4
                  onReady={() => {
                    setIsReadyForNextState(true)
                  }}
                />
              )  
            case 4: 
              return (
                <ChangePasswordScreen_5
                  type={method}
                  onReady={() => {
                    setIsReadyForNextState(true)
                  }}
                />
              )
            default: 
              return (
                <View />
              )
          }
        })()}
      </View>


      <View
        style={styles.buttonContainer}
      >
        {(() => {
          if (currentState != 0 && currentState != 4) {
            return (
              <Buttons 
                buttonName={strings.back}
                state={currentState}
                onStateChange={(value) => {
                  setCurrentState(value)
                }}
              />
            )
          }   
          return null;
        })()}
        <Buttons
          buttonName={
            currentState == 4
            ? strings.finish
            : strings.next
          }
        />
      </View>

      <ProgressBar
        onStateChange={value => {
          setCurrentState(value);
        }}
        num={5}
        activeIndex={currentState}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    height: windowHeight - (windowHeight / 5),
    width: windowWidth - (windowWidth / 7),
    borderRadius: 25,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: -5
  },
  button: {
    marginLeft: 5,
    marginTop: 16,  
    backgroundColor: COLORS.black,
    paddingVertical: 4,
    paddingHorizontal: 30,
    borderRadius: 15,
    elevation: 3,
  },
})