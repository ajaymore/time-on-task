import React from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

class ClassList extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Classes, ${navigation.state.params.schoolName}`
  });

  state = {
    isRefreshing: false,
    swipedItem: null
  };

  _observations = (classroomId, classSubject) => {
    const { navigate } = this.props.navigation;
    const isAllowed = this.props.navigation.state.params.ownerShip !== 'shared';
    navigate('Observations', { classSubject, classroomId, isAllowed });
  };

  _addClass = () => {
    const { navigate } = this.props.navigation;
    navigate('AddClass', {
      schoolId: this.props.navigation.state.params.schoolId
    });
  };

  _onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.props.data.refetch().then(() => {
      this.setState({
        isRefreshing: false
      });
    });
  };

  _getListItem = classroom => {
    const listItem = (
      <TouchableOpacity
        key={classroom.id}
        onPress={this._observations.bind(this, classroom.id, classroom.subject)}
        style={styles.seperator}
      >
        <Text>Subject: {classroom.subject}</Text>
        <Text>Grade: {classroom.grade}</Text>
        <Text>Taught by: {classroom.teacher}</Text>
      </TouchableOpacity>
    );
    return this.props.navigation.state.params.ownerShip === 'owned' ? (
      <Swipeout
        autoClose
        key={classroom.id}
        onOpen={() => {
          this.setState({
            swipedItem: classroom
          });
        }}
        right={[
          {
            text: 'Edit',
            type: 'primary',
            onPress: () => {
              console.log('edit pressed', this.state.swipedItem);
              this.setState({
                swipedItem: null
              });
            }
          },
          {
            text: 'Delete',
            type: 'delete',
            onPress: () => {
              if (this.state.swipedItem.observations.length) {
                alert(
                  'Please delete associated observations before deleting this item'
                );
                return;
              }
              Alert.alert(
                'Are you sure?',
                'This action will delete the class',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                  },
                  {
                    text: 'OK',
                    onPress: async () => {
                      await this.props.mutate({
                        variables: {
                          classroomId: this.state.swipedItem.id
                        },
                        refetchQueries: [
                          {
                            query: getSchool,
                            variables: {
                              schoolId: this.props.navigation.state.params
                                .schoolId
                            }
                          }
                        ]
                      });
                      this.setState({
                        swipedItem: null
                      });
                    }
                  }
                ],
                { cancelable: false }
              );
            }
          }
        ]}
      >
        {listItem}
      </Swipeout>
    ) : (
      listItem
    );
  };

  render() {
    const { data: { getSchool } } = this.props;
    const { ownerShip } = this.props.navigation.state.params;
    return (
      <View style={{ flex: 1 }}>
        {ownerShip === 'owned' ? (
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
              onPress={this._addClass}
            />
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                title="Loading..."
              />
            }
          >
            {!getSchool
              ? null
              : getSchool.classrooms.map(classroom =>
                  this._getListItem(classroom)
                )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export const getSchool = gql`
  query getSchool($schoolId: ID!) {
    getSchool(schoolId: $schoolId) {
      address
      id
      name
      classrooms {
        id
        observations {
          id
        }
        subject
        teacher
        totalStudents
        type
        grade
      }
    }
  }
`;

const deleteClassroomMutation = gql`
  mutation deleteClassroom($classroomId: ID!) {
    deleteClassroom(classroomId: $classroomId)
  }
`;

export default compose(
  graphql(getSchool, {
    options: props => {
      return {
        variables: { schoolId: props.navigation.state.params.schoolId }
      };
    }
  }),
  graphql(deleteClassroomMutation)
)(ClassList);

const styles = StyleSheet.create({
  seperator: {
    borderBottomWidth: 3,
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 10
  }
});
