import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  Pressable
} from 'react-native'

import COLORS from './src/theme/colors'
import ProgressBar from './src/components/ProgressBar';
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
        source={require('../PetAssistant/src/assets/icons/EmailSend.png')}
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


export default function ChangePasswordScreen_2() {
  const [isActived, setIsActived] = useState([
    false,
    false,
    false
  ])

  return (
    <View
      style={
        styles.background
      }
    >
      <View
        style={styles.card}
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
          onPress={() => {
            setIsActived([true, false, false])
          }}
        >
          <VertificationMethod
            isActived={isActived[0]}
            methodName='via email:'
            userCredential='tngcdng@gmail.com'
          />
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => {
            setIsActived([false, true, false])
          }}
        >
          <VertificationMethod
            isActived={isActived[1]}
            methodName='via sms:'
            userCredential='+84 945 454 454'
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsActived([false, false, true])
          }}
        >
          <VertificationMethod
            isActived={isActived[2]}
            methodName='via question:'
            userCredential='Some question about your pet'
          />
        </TouchableOpacity>

      </View>

      <Pressable
          style={styles.button}
        >
           <Text
            style={{
              fontSize: 18,
              color: COLORS.white,
              fontFamily: 'RedHatText',
              fontWeight: '700',
            }}
           >
             NEXT
           </Text>
        </Pressable>

      <ProgressBar
        num={5}
        activeIndex={1}
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
    height: windowHeight - (windowWidth / 1.5),
    width: windowWidth - (windowWidth / 7),
    borderRadius: 25,
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