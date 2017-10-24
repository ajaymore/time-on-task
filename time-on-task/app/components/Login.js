import React, { Component } from 'react';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { connect } from 'react-redux';
import { loginUser } from '../actions';

import { View } from 'react-native';

class Login extends Component {
  componentDidMount() {
    this._setupGoogleSignin();
  }

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        offlineAccess: false
      });
    } catch (err) {
      console.log('Play services error', err.code, err.message);
    }
  }

  _signIn() {
    GoogleSignin.signIn()
      .then(({ accessToken }) => {
        this.props.loginUser(accessToken);
      })
      .catch(err => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }
  render() {
    return (
      <View>
        <GoogleSigninButton
          style={{ width: 48, height: 48 }}
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._signIn.bind(this)}
        />
      </View>
    );
  }
}

export default connect(() => ({}), { loginUser })(Login);
