import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Home from './Home';
import AddSchool from './AddSchool';
import ClassList from './ClassList';
import Observations from './Observations';
import AddClass from './AddClass';
import Recorder from './Recorder';
import AddCollaboration from './AddCollaboration';
import { Text } from 'react-native';

export default StackNavigator({
  Home: { screen: Home },
  AddSchool: { screen: AddSchool },
  AddClass: { screen: AddClass },
  ClassList: { screen: ClassList },
  Observations: { screen: Observations },
  Recorder: { screen: Recorder },
  AddCollaboration: { screen: AddCollaboration }
});
