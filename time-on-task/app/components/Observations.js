import React from 'react';
import { Text, View, Button } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Observations extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Observations for class ${navigation.state.params.className}`
  });

  _addRecord = () => {
    const { navigate } = this.props.navigation;
    navigate('Recorder', {});
  };
  render() {
    const { data: { getClassroom } } = this.props;
    return (
      <View>
        <Text>Observations</Text>
        <Text>{this.props.navigation.state.params.classSubject}</Text>
        <Button title="add a recording" onPress={this._addRecord} />
        {!getClassroom
          ? null
          : getClassroom.observations.map(item => (
              <View key={item.id}>
                <Text>{item.readings}</Text>
              </View>
            ))}
      </View>
    );
  }
}

const addObservationMutation = gql`
  mutation addObservation($input: ObservationInput!, $classroomId: ID!) {
    addObservation(input: $input, classroomId: $classroomId) {
      id
    }
  }
`;

const getObservations = gql`
  query getClassroom($classroomId: ID!) {
    getClassroom(classroomId: $classroomId) {
      id
      observations {
        endtime
        id
        starttime
        readings
      }
      subject
      teacher
      totalStudents
    }
  }
`;

export default graphql(getObservations, {
  options: props => {
    return {
      variables: { classroomId: props.navigation.state.params.classroomId }
    };
  }
})(Observations);
