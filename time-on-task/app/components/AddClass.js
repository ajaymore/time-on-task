import React from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSchool } from './ClassList';
import { Formik } from 'formik';
import Yup from 'yup';

class AddClass extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Add a class`
  });

  _create = async ({ type, grade, totalStudents, subject, teacher }, cb) => {
    const schoolId = this.props.navigation.state.params.schoolId;
    try {
      const mutationResult = await this.props.mutate({
        variables: {
          input: {
            type,
            grade,
            totalStudents,
            subject,
            teacher,
            school: schoolId
          }
        },
        refetchQueries: [
          {
            query: getSchool,
            variables: { schoolId }
          }
        ]
      });
      cb();
      const { goBack } = this.props.navigation;
      goBack();
    } catch (err) {
      cb(err);
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={'padding'}
        keyboardVerticalOffset={65}
      >
        <Formik
          initialValues={{
            type: '',
            grade: '',
            totalStudents: '0',
            subject: '',
            teacher: ''
          }}
          /* validate={this._validate} */
          validationSchema={() =>
            Yup.object().shape({
              subject: Yup.string()
                .required('Subject is required!')
                .min(2)
                .max(30),
              totalStudents: Yup.string().required(
                'Total students is required!'
              ),
              grade: Yup.string().required('Grade is required!'),
              type: Yup.string().required(
                'School type is required teachin/non-teching'
              ),
              teacher: Yup.string().required('Teacher name is required')
            })}
          onSubmit={(
            values,
            {
              setSubmitting,
              setErrors,
              resetForm /* setValues and other goodies */
            }
          ) => {
            this._create(values, err => {
              if (err) {
                alert('Error occurred!!');
                console.log(err);
                setSubmitting(false);
              } else {
                resetForm();
              }
            });
          }}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue
          }) => (
            <View>
              <TextInput
                onChangeText={text => setFieldValue('subject', text)}
                value={values.subject}
                placeholder="subject"
              />
              {touched.subject &&
                errors.subject && <Text>{errors.subject}</Text>}
              <TextInput
                onChangeText={text => setFieldValue('teacher', text)}
                value={values.teacher}
                placeholder="teacher"
              />
              {touched.teacher &&
                errors.teacher && <Text>{errors.teacher}</Text>}
              <TextInput
                onChangeText={text => setFieldValue('type', text)}
                value={values.type}
                placeholder="type"
              />
              {touched.type && errors.type && <Text>{errors.type}</Text>}
              <TextInput
                onChangeText={text => setFieldValue('grade', text)}
                value={values.grade}
                multiline={true}
                numberOfLines={4}
                placeholder="grade"
              />
              {touched.grade && errors.grade && <Text>{errors.grade}</Text>}
              <TextInput
                onChangeText={text => setFieldValue('totalStudents', text)}
                value={values.totalStudents}
                placeholder="totalStudents"
              />
              {touched.totalStudents &&
                errors.totalStudents && <Text>{errors.totalStudents}</Text>}
              <Button
                onPress={handleSubmit}
                disabled={isSubmitting}
                title="Submit"
              />
            </View>
          )}
        />
        <View style={{ height: 60 }} />
      </KeyboardAvoidingView>
    );
  }
}

const addClassMutation = gql`
  mutation createClassroom($input: ClassroomInput!) {
    createClassroom(input: $input) {
      id
      subject
      teacher
      totalStudents
    }
  }
`;

export default graphql(addClassMutation)(AddClass);
