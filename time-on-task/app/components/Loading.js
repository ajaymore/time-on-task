import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default class Initializing extends Component {
  render() {
    return (
      <View style={{ marginTop: 150 }}>
        <ActivityIndicator
          color="#0000ff"
          size="large"
          style={{ marginBottom: 20 }}
        />
        <Text style={styles.text}>{this.props.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: '#000',
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold'
  }
});
