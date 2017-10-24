import React from 'react';
import { Text, View, Button } from 'react-native';

class AddCollaboration extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `For school ${navigation.state.params.schoolName}`
  });
  render() {
    return (
      <View>
        <Text>AddCollaboration</Text>
      </View>
    );
  }
}

export default AddCollaboration;
