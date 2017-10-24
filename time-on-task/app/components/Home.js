import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import Loading from './Loading';
import { Formik } from 'formik';
import Yup from 'yup';
import Logout from './Logout';
import { StackNavigator } from 'react-navigation';
import AddIcon from './icons/AddIcon';

class Home extends Component {
  static navigationOptions = {
    title: 'Time On Task',
    headerRight: <Logout />
  };
  componentDidMount() {}

  _addSchool = () => {
    const { navigate } = this.props.navigation;
    navigate('AddSchool', { user: 'Lucy' });
  };

  _classlist = (schoolId, schoolName) => {
    const { navigate } = this.props.navigation;
    navigate('ClassList', { schoolName, schoolId });
  };

  _collaboration = () => {
    const { navigate } = this.props.navigation;
    navigate('AddCollaboration', { schoolName: 'Vidya Mandir' });
  };

  render() {
    const { data: { loading, error, getUser } } = this.props;
    if (loading) {
      return <Loading message="Loading" />;
    } else if (error) {
      return (
        <View>
          <Logout />
          <Text>{error.message}</Text>;
        </View>
      );
    } else {
      return (
        <View>
          <Button title="add school" onPress={this._addSchool} />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              console.log('pressed');
            }}
          >
            <Image
              style={styles.addButton}
              source={require('../assets/ic_add_circle_outline_black_24dp.png')}
            />
          </TouchableOpacity>
          <Button title="Add Collaboration" onPress={this._collaboration} />
          <Text>{getUser.userName}</Text>
          <View>
            {getUser.ownership.map(school => (
              <TouchableOpacity
                key={school.id}
                onPress={this._classlist.bind(this, school.id, school.name)}
                style={styles.seperator}
              >
                <Text>{school.name}</Text>
                <Text>{school.address}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
  }
}

export const userQuery = gql`
  query getUser {
    getUser {
      createdAt
      email
      id
      userName
      sharedSchools {
        address
        name
        id
      }
      contributions {
        id
        name
      }
      ownership {
        address
        name
        id
      }
    }
  }
`;

export default graphql(userQuery)(Home);

const styles = StyleSheet.create({
  seperator: {
    borderBottomWidth: 1,
    borderBottomColor: 'red'
  },
  addButton: {
    width: 50,
    height: 50
  }
});
