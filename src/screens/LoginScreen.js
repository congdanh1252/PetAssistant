import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  Pressable
} from 'react-native'
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { Input } from 'react-native-elements/dist/input/Input';
import { 
  Ionicons, 
  AntDesign, 
  MaterialIcons   
} from 'react-native-vector-icons';

import COLORS from '../theme/colors'
import strings from '../data/strings';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function LoginScreen({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [isTypingUsername, setIsTyingUsername] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [loginState, setLoginState] = useState(strings.oopsForgetPassword);

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) {
      navigation.navigate('MainStack')
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  if (initializing) return null;

  const login = () => {
    console.log(username + "/" + password);
    auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        console.log('Signed in!');
        console.log(user.email)
        navigation.navigate('MainStack')
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Thất bại!',
          text2: 'Thông tin đăng nhập không chính xác!'
        });
      }); 
  }

  const checkLogin = () => {
    if (username == "" || password == "") {
      Toast.show({
        type: 'error',
        text1: 'Thất bại!',
        text2: 'Vui lòng nhập đủ thông tin!'
      });
    } else {
      login()
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
          <Image
            source={require('../assets/icons/Logo.png')}
            style={styles.logo}
          >
          </Image>
  
          {/* USERNAME INPUT */}
          <Input
            inputStyle={styles.textStyle}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            label={strings.username}
            placeholder={strings.enterUsername}
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
            label={strings.password}
            labelStyle={styles.label}
            placeholder={strings.enterPassword}
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangePasswordScreen')
            }}
          >
            <Text
              style={styles.forgetText}
            >
              {loginState}
            </Text>
          </TouchableOpacity>
  
  
          {/* LOGIN BUTTON */}
          <Pressable
            onPress={() => {
              checkLogin()
            }}
            style={styles.button}
          >
             <Text
              style={{
                fontSize: 18,
                color: COLORS.white,
                fontFamily: 'Roboto-Light',
                fontWeight: '700',
              }}
             >
               ĐĂNG NHẬP
             </Text>
          </Pressable>
  
          <Text
            style={styles.orText}
          >
            HOẶC
          </Text>
  
          {/* SOCIAL ICONS */}
          {/* <View
            style={styles.socialContainer}
          >
            <Image
              source={require('../assets/icons/Facebook.png')}
              style={styles.socialIcon}
            >
            </Image>
            <Image
              source={require('../assets/icons/Google.png')}
              style={styles.socialIcon}
            >
            </Image>
            <Image
              source={require('../assets/icons/Phone.png')}
              style={styles.socialIcon}
            >
            </Image>
          </View> */}
  
          <View
            style={{
              marginTop: 20,
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >       
            <Text style={{color: COLORS.black, fontSize: 16}}>
              {strings.noaccount} {" "}
            </Text>
  
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RegisterStack')
              }}
            >
              <Text
                style={styles.registerText}
              >
                {strings.register}
              </Text>
            </TouchableOpacity>
          </View>
  
      </View>
    )
  } else {
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    fontSize: 16,
    color: COLORS.blue,
    alignSelf: 'flex-end',
  },
  button: {
    marginTop: 20,  
    backgroundColor: COLORS.black,
    paddingVertical: 8,
    paddingHorizontal: 100,
    borderRadius: 8,
    elevation: 3,
  },
  orText: {
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 20,
    color: COLORS.black
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
    fontSize: 16,
    color: COLORS.blue,
  },
});
