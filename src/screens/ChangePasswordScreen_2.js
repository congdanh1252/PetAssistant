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


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VertificationMethod = (props) => {
  return(
    <View
      style={styles.methodContainer}
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

const ProgressBar = (props) => {
  var dotLoop=[];
  for (let i = 0; i < props.num; i++) {
    if (i == props.active) {
    }
    dotLoop.push(
      <View
        key={i}
      >
        {(() => {
          if (i == props.activeIndex){
              return (
                  <View
                    style={styles.activeDot}
                  />
              )
          }
          return (
            <View
              style={styles.dot}
            />
          );
        })()}
      </View>
    );
  }
  return (
    <View
      style={styles.progressBar}
    >
      {dotLoop}
    </View>
  )
}

export default function App() {
  return (
    <View
      style={styles.background}
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

        <VertificationMethod
          methodName='via email:'
          userCredential='tngcdng@gmail.com'
        />

        <VertificationMethod
          methodName='via sms:'
          userCredential='+84 945 454 454'
        />

        <VertificationMethod
          methodName='via question:'
          userCredential='Some question about your pet'
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
  dot: {
    backgroundColor: COLORS.dot,
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8, 
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: COLORS.primaryDark,
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8, 
    marginRight: 8,
  },
  progressBar: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
  },
  methodContainer: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grey,
    marginTop: 20,
    borderRadius: 5,
    marginLeft: 8, 
    marginRight: 8,
  },
  methodImage: {
    height: 36,
    width: 36,
    marginLeft: 20,
    marginRight: 20,
  }
})