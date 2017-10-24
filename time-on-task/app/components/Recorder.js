import React from 'react';
import { Text, View, Button } from 'react-native';

class Recorder extends React.Component {
  static navigationOptions = {
    title: `Recording`
  };
  render() {
    return (
      <View>
        <Text>Recorder</Text>
      </View>
    );
  }
}

export default Recorder;
