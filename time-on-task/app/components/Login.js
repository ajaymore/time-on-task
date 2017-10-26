import React, { Component } from 'react';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { connect } from 'react-redux';
import { loginUser } from '../actions';
import { LOGIN_IN_PROGRESS } from '../ActionTypes';
import { withApollo } from 'react-apollo';
import { View, Text } from 'react-native';

class Login extends Component {
  componentDidMount() {
    this.props.client.resetStore();
    this._setupGoogleSignin();
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        offlineAccess: false
      });
      GoogleSignin.currentUserAsync()
        .then(async user => {
          await GoogleSignin.signOut();
        })
        .done();
    } catch (err) {
      console.log('Play services error', err.code, err.message);
    }
  }

  _signIn() {
    GoogleSignin.signIn()
      .then(({ accessToken }) => {
        if (this.props.status !== LOGIN_IN_PROGRESS && accessToken) {
          this.props.loginUser(accessToken);
        }
      })
      .catch(err => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 8 }}
        >
          <Text style={{ fontSize: 40 }}>Time</Text>
          <Text style={{ fontSize: 25 }}>on</Text>
          <Text style={{ fontSize: 40, marginBottom: 30 }}>Task</Text>
        </View>
        <View
          style={{ justifyContent: 'center', alignItems: 'center', flex: 2 }}
        >
          <GoogleSigninButton
            style={{ width: 230, height: 48 }}
            size={GoogleSigninButton.Size.Standard}
            color={GoogleSigninButton.Color.Light}
            onPress={this._signIn.bind(this)}
          />
        </View>
      </View>
    );
  }
}

export default withApollo(
  connect(({ auth }) => ({ status: auth.status }), { loginUser })(Login)
);
