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
import { TouchableOpacity } from 'react-native-gesture-handler';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VertificationMethod = (props) => {
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
        source={require('../../assets/icons/EmailSend.png')}
        style={styles.methodImage}
      />

      <View
      >
        <Text
          style={{
            fontWeight: '200',
            marginBottom: 10,
          }}
        >
          {props.methodName}
        </Text>
        <Text
          style={{
            fontWeight: '700',
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
          MAKE {"\n"}
          YOUR CHOICE
        </Text>

        <Text
          style={{
            marginLeft: 20,
            fontWeight: '700',
          }}
        >
          Choose your vetification method
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
            methodName='via email:'
            userCredential={
              isEmailHidden
              ? transformCredential(props.email, 'email')
              : 'Not available'
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
            methodName='via sms:'
            userCredential={
              isPhoneHidden
              ? transformCredential(props.phoneNumber, 'phone')
              : 'Not available'
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
            methodName='via question:'
            userCredential='Some question about your pet'
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
    height: 90,
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