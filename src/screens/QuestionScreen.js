import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native'
import { Button} from 'react-native-elements/dist/buttons/Button';
import { Input } from 'react-native-elements/dist/input/Input'
import { TextInput, TouchableOpacity  } from 'react-native-gesture-handler';
// import { Input } from 'react-native-elements';
import COLORS from '../theme/colors';
 
// import Icon from 'react-native-vector-icons/FontAwesome';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const QuestionScreen = () => {
  return (
    <View style={styles.background}>
      <View style={styles.card}>
        <Text style={styles.header}>
          JUST{"\n"}SIMPLE QUESTION
        </Text>
        <Text style={styles.smallText}>
          Answer these question below
        </Text>
        <View style={styles.inputBox}>
          <Text style={styles.textCenter}>1. What's your pet's name?</Text>
          <TextInput style={styles.textInput}
            placeholder='Goffy'
            placeholderTextColor = 'rgba(0, 0, 0, 0.5)'
          />
        </View>
        <View style={styles.smallBtnContainer}>
          <Button
            icon={{ name: "chevron-right", size: 50, type: 'fontawesome', color: COLORS.primary }}
            iconRight
            TouchableComponent={TouchableOpacity}
          />
          <ProgressBar num={3}
            activeIndex={2}
            active = {1}
            thickness = {10}
          />
        </View>
      </View>         
      <View style={styles.buttonContainer}>       
          <Button buttonStyle={styles.button} title="BACK"
            type="outline"
            TouchableComponent={TouchableOpacity}
            titleStyle = {styles.buttonTitle}
          />

          <Button buttonStyle={styles.button} title="NEXT"
            type="outline"
            TouchableComponent={TouchableOpacity}
            titleStyle = {styles.buttonTitle}
          />
      </View>
      <ProgressBar num={5}
        activeIndex={3}
        active = {1}
        thickness = {32}
      />     
    </View>
  )
}
const styles = StyleSheet.create({
    background:{
        backgroundColor: COLORS.primary,
        alignItems:'center',
        width: windowWidth,
        height: windowHeight,
    },
    card:{
      backgroundColor: COLORS.white,
      
      marginTop: 45,
      height: windowHeight - (windowWidth / 1.5),
      width: windowWidth - (windowWidth / 7),
      borderRadius: 25,

    },
    header:{
        paddingTop: 20,
        paddingHorizontal: 15,
        textAlign: 'left',

        color: 'black',
        fontSize: 25,
        fontFamily: 'RedHatText-Bold', 
    },
    smallText:{
        color: 'black',
        fontSize: 15,        
        fontFamily: 'RedHatText', 
        textAlign: 'left',        
        paddingHorizontal: 15,
    },
    textCenter:{
        color: 'black',
        fontSize: 15,        
        fontFamily: 'RedHatText-Bold', 
        textAlign: 'center',        
        paddingHorizontal: 15,
    },
    inputBox:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        height: 45,
    },
    textInput:{
        marginTop: 30,
        width: '60%',
        color: "#000",
        textAlign: 'center',
        backgroundColor: '#EEEEEE',
        borderRadius: 15,
        padding: 10,
    },
    smallBtnContainer:{
        flex: 0.5,
        width: '100%',
    },
    buttonContainer:{
        alignItems: 'center',
        height: 120,
        width: windowWidth * 0.7,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button:{
        marginHorizontal: 5,
        height: 50,
        backgroundColor: COLORS.primaryDark,
        width: 140, 
        borderRadius: 10,
    },
    buttonTitle:{
        fontFamily: 'RedHatText',
        color: 'white',
        fontSize: 20,
    }
})

export default QuestionScreen;








const ProgressBar = (props) => {
    var dotLoop=[];
    let thickness = props.thickness;
    const dotStyle = StyleSheet.create({
      dot: {
        backgroundColor: COLORS.dot,
        width: thickness,
        height: thickness,
        borderRadius: 16,
        marginLeft: 8, 
        marginRight: 8,
      },
      activeDot: {
        backgroundColor: COLORS.primaryDark,
        width: thickness,
        height: thickness,
        borderRadius: 16,
        marginLeft: 8, 
        marginRight: 8,
      },
      progressBar:{
        flexDirection: 'row',
        justifyContent: 'center'
      }
  });
    for (let i = 0; i < props.num; i++) {
      if (i == props.active) {
      }
      dotLoop.push(
        <View
          key={i}
        >
          {(() => {
            if (i == props.active){
                return (
                    <View
                      style={dotStyle.activeDot}
                    />
                )
            }
            return (
              <View
                style={dotStyle.dot}
              />
            );
          })()}
        </View>
      );
    }
    return (
      <View
        style={dotStyle.progressBar}
      >
        {dotLoop}
      </View>
    )
  }
const dotStyle = StyleSheet.create({
    dot: {
      backgroundColor: COLORS.dot,
      width: 18,
      height: 18,
      borderRadius: 16,
      marginLeft: 8, 
      marginRight: 8,
    },
    activeDot: {
      backgroundColor: COLORS.primaryDark,
      width: 18,
      height: 18,
      borderRadius: 16,
      marginLeft: 8, 
      marginRight: 8,
    },
    progressBar:{
      flexDirection: 'row',
      justifyContent: 'center'
    }
});