import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { SocialIcon } from 'react-native-elements/dist/social/SocialIcon';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app</Text>
      <SocialIcon
        style={{width: 200}}
        title='Sign In With Facebook'
        button
        type='facebook'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
