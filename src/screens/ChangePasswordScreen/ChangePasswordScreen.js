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
import { User } from '../../models/user'

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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Buttons = (props) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        props.buttonName == 'Back' 
        ? props.onStateChange(props.state - 1)
        : props.state == 1 && props.method == 'email'
        ? props.onStateChange(4)
        : props.onStateChange(props.state + 1)
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

const sendEmailVertification = (email) => {
  // console.log(email);
  auth().sendPasswordResetEmail(email);
}

export const ChangePasswordScreen = () => {
  const [currentState, setCurrentState] = useState(0);
  const [method, setMethod] = useState(null);
  const [email, setEmail] = useState('Not available')
  const [phoneNum, setPhoneNum] = useState('Not available')

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
                  onGetEmail={value => {
                    setEmail(value)
                  }}
                  onGetPhoneNum={value => {
                    setPhoneNum(value)
                  }}
                />
              )
            case 1: 
              return (
                <ChangePasswordScreen_2
                  phoneNumber={phoneNum}
                  email={email}
                  onMethodChange={value => {
                    setMethod(value);
                  }}
                />
              )
            case 2: 
              if (method == 'sms') {
                return (
                  <ChangePasswordScreen_3_1/>
                )
              }
              return (
                <ChangePasswordScreen_3_2 />
              )
            case 3: 
              return (
                <ChangePasswordScreen_4 />
              )  
            case 4: 
              return (
                <ChangePasswordScreen_5
                  type={method}
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
                buttonName='Back'
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
          method={method}
          buttonName={
            currentState == 4
            ? 'Finish'
            : 'Next'
          }
          state={currentState}
          onStateChange={(value) => {
            setCurrentState(value)
            if (method == 'email') {
              sendEmailVertification(email);
            }
          }}
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
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    marginTop: 45,
    height: windowHeight - (windowWidth / 1.8),
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
    marginTop: 50,  
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 15,
    elevation: 3,
  },
})