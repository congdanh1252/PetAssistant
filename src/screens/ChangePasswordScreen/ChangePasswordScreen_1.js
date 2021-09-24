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

import COLORS from '../../theme/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export const ChangePasswordScreen_1 = (props) => {
  const [isTypingCredential, setIsTypingCredential] = useState(false);
  const [credential, setCredential] = useState('');
  const [credentialType, setCredentialType] = useState('Email');
  const [credentialIcon, setCredentialIcon] = useState('email')
  const [username, setUsername] = useState(null);
  const [isFoundUser, setIsFoundUser] = useState(false);

  const findProfile = (credential, type) => {
    firestore()
      .collection('users')
      .where(type.toLowerCase(), '==', credential)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          setUsername(querySnapshot.docs[0].data().name);
          setIsFoundUser(true);
          var phoneNum = querySnapshot.docs[0].data().phone
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
          Can't find your account, {"\n"}
          Plese check your information and try again
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
            FORGET {"\n"}
            PASSWORD
          </Text>

          <Text
            style={styles.sub_title}
          >
            Provide your account's credential
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
            placeholder={"Enter " + credentialType.toLowerCase()}
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
              input.length>0 
              ? setIsTypingCredential(true)
              : setIsTypingCredential(false)
              setCredential(input)
            }}
          />

          <Text
            onPress={() => {      
                setCredential('')
                setIsFoundUser(false)
                if (credentialType === 'Email') {
                  setCredentialType('Phone')
                  setCredentialIcon('local-phone')
                } else {
                  setCredentialType('Email')
                  setCredentialIcon('email')
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
            {"Use " + credentialType.toLowerCase() + " instead?"}
          </Text>

          {renderUserProfile(username, "", isFoundUser)}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              findProfile(credential, credentialType);
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: COLORS.white,
                fontFamily: 'RedHatText',
                fontWeight: '700',
                textAlign: 'center'
              }}
              >
              Find account
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