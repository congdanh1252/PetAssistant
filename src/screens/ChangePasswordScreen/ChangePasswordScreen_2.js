import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  Pressable
} from 'react-native'

import COLORS from '../../theme/colors'
import strings from '../../data/strings';

import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  SendMailIcon,
  SMSIcon,
  AskQuestionIcon
} from '../../assets/icons'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VertificationMethod = (props) => {
  var methodIcon = SendMailIcon
  console.log(props.methodName);
  switch (props.methodName) {
    case "tin nhắn:":
      methodIcon = SMSIcon
      break;

    case "câu hỏi:":
        methodIcon = AskQuestionIcon
      break;
  
    default:
    case "email:":
      methodIcon = SendMailIcon
      break;
  }
  return(
    <View
      style={StyleSheet.flatten([
        styles.methodContainer,
        props.isActived == false
        ? styles.methodContainerGrey 
        : styles.methodContainerBlue
      ])}
    >
      <Image
        source={methodIcon}
        style={styles.methodImage}
      />

      <View
      >
        <Text
          style={{
            fontWeight: '200',
            marginBottom: 10,
            color: COLORS.black,
          }}
        >
          {props.methodName}
        </Text>
        <Text
          style={{
            fontWeight: '700',
            color: COLORS.black,
          }}
        >
          {props.userCredential}
        </Text>
      </View>

      {/* <Image
        source={require('../PetAssistant/src/assets/icons/Ok.png')}
      /> */}
    </View>
  )
}


export const ChangePasswordScreen_2 = (props) => {
  const [isActived, setIsActived] = useState([
    false,
    false,
    false
  ])

  const [isEmailHidden, setIsEmailHidden] 
    = useState(
      props.email == ''
      ? false
      : true
    )
  const [isPhoneHidden, setIsPhoneHidden] 
    = useState(
      props.phoneNumber == ''
      ? false
      : true
    )

  const transformCredential = (item, type) => {
    switch (type) {
        case 'email':
            var parts = item.split("@");
            var len = parts[0].length;
            return item.replace(parts[0].slice(1, -2), "*".repeat(4));
        case 'phone':
            return item[0] + item[1] + "*".repeat(item.length - 4) + item.slice(-3);
      default: 
            throw new Error("Undefined type: " + type);
    }        
  }

  return (
    <View
      style={styles.container}
    >
        <Text
          style={styles.title}
        >
          {strings.choose}
        </Text>

        <Text
          style={{
            marginLeft: 20,
            fontWeight: '700',
            color: COLORS.black,
          }}
        >
          {strings.chooseVertificationMethod}
        </Text>

        <TouchableOpacity
          disabled={!isEmailHidden}
          onPress={() => {
            setIsActived([true, false, false])
            props.onMethodChange('email')
            props.onReady(true)
          }}
        >
          <VertificationMethod
            isActived={isActived[0]}
            methodName='email:'
            userCredential={
              isEmailHidden
              ? transformCredential(props.email, 'email')
              : strings.notAvailable
            } 
          />
        </TouchableOpacity>


        <TouchableOpacity
          disabled={!isPhoneHidden}
          onPress={() => {
            setIsActived([false, true, false])
            props.onMethodChange('sms')
            props.onReady(true)
          }}
        >
          <VertificationMethod
            isActived={isActived[1]}
            methodName='tin nhắn:'
            userCredential={
              isPhoneHidden
              ? transformCredential(props.phoneNumber, 'phone')
              : strings.notAvailable
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsActived([false, false, true])
            props.onMethodChange('question')
            props.onReady(true)
          }}
        >
          <VertificationMethod
            isActived={isActived[2]}
            methodName='câu hỏi:'
            userCredential={strings.questionAboutYourPet}
          />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'left',
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 20,
    color: COLORS.black,
  },
  button: {
    marginTop: 50,  
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 10,
    elevation: 3,
  },
  methodContainer: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
    marginLeft: 8, 
    marginRight: 8,
  },
  methodContainerGrey: {
    backgroundColor: COLORS.grey,
  },
  methodContainerBlue: {
    backgroundColor: COLORS.blue,
  },
  methodImage: {
    height: 36,
    width: 36,
    marginLeft: 20,
    marginRight: 20,
  }
})