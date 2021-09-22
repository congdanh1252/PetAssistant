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

import COLORS from './src/theme/colors'
import ProgressBar from './src/components/ProgressBar'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const UserProfile = (props) => {
  return(
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
          source={require('../PetAssistant/src/assets/icons/dog.png')}
          style={styles.userImage}
        >
        </Image>
        <Text>
          {props.name}
        </Text>
      </View>

      <Image
        source={require('../PetAssistant/src/assets/icons/Ok.png')}
      />
    </View>
  )
}

export default function ChangePasswordScreen_1() {
    const [isTypingCredential, setIsTypingCredential] = useState(false);
    const [credential, setCredential] = useState('');
    const [credentialType, setCredentialType] = useState('Email');
    const [credentialIcon, setCredentialIcon] = useState('email')

  return (
    <View
      style={styles.background}
    >
      <View
        style={styles.card}
      >
        <Image
          source={require('../PetAssistant/src/assets/icons/dog-food.png')}
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
            input.length>0 
            ? setIsTypingCredential(true)
            : setIsTypingCredential(false)
            setCredential(input)
          }}
        />

        <Text
          onPress={() => {         
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

        <UserProfile
          //url= "require('your-image-path/logo.png')"
          name="Goofy"
        />

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
        activeIndex={0}
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
    marginTop: 50,  
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 15,
    elevation: 3,
  },
  icon: {
    marginRight: 5,
  }
})