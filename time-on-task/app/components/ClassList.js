import React from 'react';
import { Text, View, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

class ClassList extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Classes for school ${navigation.state.params.schoolName}`
  });

  _observations = (classroomId, classSubject) => {
    const { navigate } = this.props.navigation;
    navigate('Observations', { classSubject, classroomId });
  };

  _addClass = () => {
    const { navigate } = this.props.navigation;
    navigate('AddClass', {
      schoolId: this.props.navigation.state.params.schoolId
    });
  };

  render() {
    const { data: { getSchool } } = this.props;
    return (
      <View>
        <Text>ClassList</Text>
        <Button title="Add Class" onPress={this._addClass} />
        <View>
          {!getSchool
            ? null
            : getSchool.classrooms.map(classroom => (
                <TouchableOpacity
                  key={classroom.id}
                  onPress={this._observations.bind(
                    this,
                    classroom.id,
                    classroom.subject
                  )}
                  style={styles.seperator}
                >
                  <Text>{classroom.subject}</Text>
                  <Text>{classroom.grade}</Text>
                </TouchableOpacity>
              ))}
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

export default graphql(getSchool, {
  options: props => {
    return {
      variables: { schoolId: props.navigation.state.params.schoolId }
    };
  }
})(ClassList);

const styles = StyleSheet.create({
  seperator: {
    borderBottomWidth: 1,
    borderBottomColor: 'red'
  }
});
