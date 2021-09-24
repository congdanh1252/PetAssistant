import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  Pressable
} from 'react-native'

import auth from '@react-native-firebase/auth';
import { Input } from 'react-native-elements/dist/input/Input';
import { 
  Ionicons, 
  AntDesign, 
  FontAwesome, 
  MaterialIcons   
} from 'react-native-vector-icons';

import COLORS from './src/theme/colors'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LoginScreen() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [isTypingUsername, setIsTyingUsername] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [loginState, setLoginState] = useState('Oops, forget your password?');

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  if (initializing) return null;


  const login = (username, password) => {
    auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        console.log('Signed in!');
        console.log(user.email)
      })
      .catch(error => {
        if (error === 'auth/invalid-email') {
          setLoginState('Invalid email!')
        }

        if (error === 'auth/user-disabled') {
          setLoginState('Your account has been block!')
        }

        if (error === 'auth/user-not-found') {
          setLoginState('Cant find your account')
        }

        if (error === 'auth/wrong-password') {
          setLoginState('Wrong password')
          console.error(error);
        }
      });
  }

  return (
    <View style={styles.container}>
        <Image
          source={require('../PetAssistant/src/assets/icons/Logo.png')}
          style={styles.logo}
        >
        </Image>

        {/* USERNAME INPUT */}
        <Input
          inputStyle={styles.textStyle}
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
          label='Username'
          placeholder='Enter username'
          value={username}
          leftIcon={
            <AntDesign
              name='user'
              size={20}
              color='black'
              style={styles.icon}
            />
          }
          rightIcon={ 
            isTypingUsername==true ? (
              <MaterialIcons
                onPress={() => {
                  setUsername('')
                  setIsTyingUsername(false)
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
            ? setIsTyingUsername(true)
            : setIsTyingUsername(false)
            setUsername(input)
          }}
        />

        {/* PASSWORD INPUT */}
        <Input
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
          label='Password'
          labelStyle={styles.label}
          placeholder='Enter password'
          secureTextEntry={visiblePassword}
          value={password}
          leftIcon={
            <Ionicons
              name='key'
              size={20}
              color='black'
              style={styles.icon}
            />
          }
          rightIcon={ 
            <View
              style={{
                flexDirection: 'row'
              }}
            >
              <AntDesign
                onPress={() => {
                  setVisiblePassword(!visiblePassword)
                }}
                name='eye'
                size={20}
                color='black'
                style={styles.icon}
              />

              { 
                isTypingPassword==true ? (
                  <MaterialIcons
                    onPress={() => {
                      setPassword('')
                      setIsTypingPassword(false)
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

            </View>

          }
          onChangeText={input => {
            input.length>0 
            ? setIsTypingPassword(true)
            : setIsTypingPassword(false)
            setPassword(input)
          }}        
        />

        {/* FORGER PASSWORD */}
        <Text
          style={styles.forgetText}
        >
          {loginState}
        </Text>


        {/* LOGIN BUTTON */}
        <Pressable
          onPress={() => {
            console.log('Pressed');
            login(username, password)
          }}
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
             LOGIN
           </Text>
        </Pressable>

        <Text
          style={styles.orText}
        >
          OR
        </Text>

        {/* SOCIAL ICONS */}
        <View
          style={styles.socialContainer}
        >
          <Image
            source={require('../PetAssistant/src/assets/icons/Facebook.png')}
            style={styles.socialIcon}
          >
          </Image>
          <Image
            source={require('../PetAssistant/src/assets/icons/Google.png')}
            style={styles.socialIcon}
          >
          </Image>
          <Image
            source={require('../PetAssistant/src/assets/icons/Phone.png')}
            style={styles.socialIcon}
          >
          </Image>
        </View>

        <Text
          style={{
            marginTop: 20,
          }}
        >       
          <Text>
            Haven't got account? {" "}
          </Text>

          <Text
            style={styles.registerText}
          >
             Register now!
          </Text>
        </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  logo: {
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center'
  },
  inputContainer: {
    marginTop: 20,
    width: windowWidth - 100,
    alignSelf: 'center'
  },
  icon: {
    //marginRight: 10,
  },
  forgetText: {
    color: COLORS.primaryDark,
    alignSelf: 'flex-end',
    marginRight: 50,
  },
  button: {
    marginTop: 20,  
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 100,
    borderRadius: 4,
    elevation: 3,
  },
  orText: {
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 30,  
    marginLeft: 90,
    marginRight: 70,
  },
  socialIcon: {
    marginRight: 20,
  },
  registerText: {
    color: COLORS.primaryDark,
  },
});
