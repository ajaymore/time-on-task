import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import * as ActionTypes from '../ActionTypes';
import jwtDecode from 'jwt-decode';
import Login from './Login';
import Navigator from './Navigator';
import Loading from './Loading';

class Root extends Component {
  componentDidMount() {}

  render() {
    const { status, user } = this.props;
    if (status === ActionTypes.INITIALIZE) {
      return <Loading message="Initializing" />;
    } else if (status === ActionTypes.LOGIN_IN_PROGRESS) {
      return <Loading message="Logging in user..." />;
    } else if (status === ActionTypes.LOGOUT_IN_PROGRESS) {
      return <Loading message="Logging out user..." />;
    } else if (status === ActionTypes.LOGGED_OUT) {
      return <Login />;
    } else if (status === ActionTypes.LOGIN_COMPLETE) {
      return <Navigator />;
    }
  }
}

const mapStateToProps = ({ auth }, ownProps) => ({
  status: auth.status,
  user: auth.accessToken ? jwtDecode(auth.accessToken) : null
});

export default connect(mapStateToProps)(Root);
