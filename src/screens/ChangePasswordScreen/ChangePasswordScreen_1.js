import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  Button
} from 'react-native'

import { 
  MaterialIcons   
} from 'react-native-vector-icons';
import { Input } from 'react-native-elements/dist/input/Input';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

import COLORS from '../../theme/colors';
import strings from '../../data/strings';
import { 
  validateEmail,
  validatePhone,
} from '../../models/common/validateFunctions';
import Toast from 'react-native-toast-message';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export const ChangePasswordScreen_1 = (props) => {
  const [isTypingCredential, setIsTypingCredential] = useState(false);
  const [credentialType, setCredentialType] = useState(props.findMethod);
  const [credential, setCredential] 
    = useState(
      credentialType == 'Email'
      ? props.email
      : props.phoneNum
    )
  const [credentialIcon, setCredentialIcon] 
    = useState(
      credentialType == 'Email'
      ? 'email'
      : 'local-phone'
    )
  const [anotherCredentialType, setAnotherCredentialType] 
    = useState(
      credentialType == 'Email'
      ? strings.phone
      : strings.email
    )
  const [username, setUsername] = useState(null);
  const [isFoundUser, setIsFoundUser] = useState(false);
  const [errorState, setErrorState] = useState(false)

  const findProfile = (credential, type) => {
    firestore()
      .collection('users')
      .where(type.toLowerCase(), '==', credential)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          console.log(querySnapshot.docs[0].data());
          setUsername(querySnapshot.docs[0].data().username);
          setIsFoundUser(true);
          props.onReady(true);
          var phoneNum = querySnapshot.docs[0].data().phone_number
          phoneNum != undefined 
          ? props.onGetPhoneNum(phoneNum)
          : "";
          var email = querySnapshot.docs[0].data().email
          email != undefined 
          ? props.onGetEmail(email)
          : "";
        }
      })
  }

  const renderUserProfile = (name, image, bool) => {
    if (bool) {
      return (
        <View
          style={styles.userContainer}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('../../assets/icons/dog.png')}
              style={styles.userImage}
            >
            </Image>
            <Text>
              {name}
            </Text>
          </View>
    
          <Image
            source={require('../../assets/icons/Ok.png')}
          />
        </View>
      )
    }
    else {
      return (
        <Text
          style={{
            marginTop: 20,
            textAlign: 'center',
            fontFamily: 'RedHatText-Italic',
            fontSize: 14, 
          }}
        >
          {strings.accountNotFound}
        </Text>
      )
    }
  }

  return (
    <View
        style={styles.container}
      >
          <Image
            source={require('../../assets/icons/dog-food.png')}
            style={styles.image}
          />
          
          <Text
            style={styles.title}
          >
            {strings.forgetPassowork}
          </Text>

          <Text
            style={styles.sub_title}
          >
            {strings.provideAccountCredential}
          </Text>

          <Input
            keyboardType={
              credentialType == 'Email'
              ? 'email-address'
              : 'numeric'
            }
            value={credential}
            inputStyle={styles.textStyle}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            label={credentialType}
            placeholder={strings.enter + " " + credentialType.toLowerCase()}
            leftIcon={
              <MaterialIcons
                name={credentialIcon}
                size={20}
                color='black'
                style={styles.icon}
              />
            }
            rightIcon={
              isTypingCredential==true ? (
                  <MaterialIcons
                    onPress={() => {
                      setCredential('')
                      setIsTypingCredential(false)
                      setErrorState(false)
                      props.onReady(false)
                    }}
                    name='clear'
                    size={20}
                    color='black'
                    style={styles.icon}
                  />
                ) : (
                  null
                )
            }
            onChangeText={input => {
              setIsFoundUser(false)
              setErrorState(false)
              props.onReady(false)
              input.length>0 
              ? setIsTypingCredential(true)
              : setIsTypingCredential(false)
              setCredential(input)
            }}
          />

          {(() => {
            if (errorState) {
                return (
                  <Text
                    style={styles.errorMessage}
                  >
                    {strings.invalidInformation}
                  </Text>
                )
            }   
            return null
          })()}

          <Text
            onPress={() => {     
                setCredential('')
                setIsFoundUser(false)
                if (credentialType === strings.email) {
                  setCredentialType(strings.phone)
                  setCredentialIcon('local-phone')
                  setAnotherCredentialType('email')
                } else {
                  setCredentialType('Email')
                  setCredentialIcon('email')
                  setAnotherCredentialType(strings.phone)
                }
            }}
            style={{
              fontWeight: '200',
              fontSize: 12,
              alignSelf: 'flex-end',
              marginRight: 20,
              color: COLORS.primaryDark,
            }}
          >
            {strings.use + " " + anotherCredentialType}
          </Text>

          {renderUserProfile(username, "", isFoundUser)}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {    
              credentialType == 'Email'
              ? 
                validateEmail(credential)
                ? findProfile(credential, credentialType)
                : setErrorState(true)
              :
                validatePhone(credential)
                ? findProfile(credential, credentialType)
                : setErrorState(true);
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: COLORS.white,
                fontFamily: 'RedHatText',
                fontWeight: '700',
                textAlign: 'center'
              }}
              >
              {strings.findAccount}
            </Text>
          </TouchableOpacity>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: windowWidth / 4,
    height: windowWidth / 4,
    marginTop: 20,
    alignSelf: 'center'
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 10,
  },
  sub_title: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  inputContainer: {
    marginTop: 20,
    width: windowWidth - (windowWidth / 5),
    alignSelf: 'center',
  },
  errorMessage: {
    color: COLORS.error,
    marginTop: -10,
    marginBottom: 4,
    fontSize: 12,
    marginLeft: windowWidth / 12,
  },
  userContainer: {
    backgroundColor: COLORS.grey,
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: windowWidth / 12,
    marginRight: windowWidth / 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  userImage: {
    width: 40,
    height: 40,
    marginRight: 20,
    alignSelf: 'auto',
    alignItems: 'stretch'
  },
  button: {
    alignSelf: 'center',
    bottom: 0,
    width: '50%',
    marginTop: 20,  
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 4,
    borderRadius: 15,
    elevation: 3,
  },
  icon: {
    marginRight: 5,
  },
})