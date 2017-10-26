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
  Image,
  FlatList,
  RefreshControl
} from 'react-native';
import Loading from './Loading';
import { Formik } from 'formik';
import Yup from 'yup';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Logout from './Logout';

class Home extends Component {
  static navigationOptions = {
    title: 'School List',
    headerRight: <Logout />
  };

  state = {
    isRefreshing: false
  };

  _addSchool = () => {
    const { navigate } = this.props.navigation;
    navigate('AddSchool', { user: 'Lucy' });
  };

  _classlist = (schoolId, schoolName, ownerShip) => {
    const { navigate } = this.props.navigation;
    navigate('ClassList', { schoolName, schoolId, ownerShip });
  };

  _collaboration = (schoolName, schoolId) => {
    const { navigate } = this.props.navigation;
    navigate('AddCollaboration', { schoolName, schoolId });
  };

  _getItem = school => {
    const responsibility = {
      owned: (
        <Text style={{ color: 'green', fontWeight: 'bold' }}>Ownership</Text>
      ),
      contribs: (
        <Text style={{ color: 'orange', fontWeight: 'bold' }}>
          Contributing
        </Text>
      ),
      shared: (
        <Text style={{ color: 'black', fontWeight: 'bold' }}>Shared With</Text>
      )
    };

    return (
      <TouchableOpacity
        key={school.id}
        onPress={this._classlist.bind(
          this,
          school.id,
          school.name,
          school.type
        )}
        style={styles.schooItem}
      >
        <View style={{}}>
          <Text>{school.name}</Text>
          <Text>{school.address}</Text>
          <Text>{responsibility[school.type]}</Text>
        </View>
        {school.type === 'owned' ? (
          <View style={styles.collaborate}>
            <Icon
              name="group-add"
              type="material-icon"
              color="blue"
              size={26}
              onPress={this._collaboration.bind(this, school.name, school.id)}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  _onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.props.data.refetch().then(() => {
      this.setState({
        isRefreshing: false
      });
    });
  };

  render() {
    const { data: { loading, error, getUser } } = this.props;
    const listData = getUser
      ? [
          ...getUser.ownership.map(school => ({
            ...school,
            type: 'owned',
            key: school.id
          })),
          ...getUser.contributions.map(school => ({
            ...school,
            type: 'contribs',
            key: school.id
          })),
          ...getUser.sharedSchools.map(school => ({
            ...school,
            type: 'shared',
            key: school.id
          }))
        ]
      : [];
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
        <View style={styles.container}>
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              zIndex: 5
            }}
          >
            <Icon
              raised
              name="plus"
              type="entypo"
              color="blue"
              size={32}
              onPress={this._addSchool}
            />
          </View>
          <View style={styles.list}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  title="Loading..."
                />
              }
              data={listData}
              renderItem={({ item }) => this._getItem(item)}
            />
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

export default graphql(userQuery, {
  options: { notifyOnNetworkStatusChange: true }
})(Home);

const styles = StyleSheet.create({
  schooItem: {
    borderBottomWidth: 3,
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container: {
    flex: 1,
    paddingTop: 10
  },
  list: { flex: 1, marginTop: 10 },
  collaborate: {
    padding: 10,
    marginRight: 15,
    alignSelf: 'flex-end'
  }
});
