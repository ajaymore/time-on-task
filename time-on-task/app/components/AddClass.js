import React from 'react';
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSchool } from './ClassList';
import { Formik } from 'formik';
import Yup from 'yup';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements';

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
            totalStudents: parseInt(totalStudents, 10),
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
      <View style={{ flex: 1 }}>
        <Formik
          initialValues={{
            type: '',
            grade: '',
            totalStudents: '',
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
            <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
              <FormLabel>Subject</FormLabel>
              <FormInput
                onChangeText={text => setFieldValue('subject', text)}
                value={values.subject}
                blurOnSubmit={false}
              />
              {touched.subject &&
                errors.subject && (
                  <FormValidationMessage>
                    {errors.subject}
                  </FormValidationMessage>
                )}
              <FormLabel>Teacher</FormLabel>
              <FormInput
                onChangeText={text => setFieldValue('teacher', text)}
                value={values.teacher}
              />
              {touched.teacher &&
                errors.teacher && (
                  <FormValidationMessage>
                    {errors.teacher}
                  </FormValidationMessage>
                )}
              <FormLabel>Type of classroom (T/NT)</FormLabel>
              <FormInput
                onChangeText={text => setFieldValue('type', text)}
                value={values.type}
              />
              {touched.type &&
                errors.type && (
                  <FormValidationMessage>{errors.type}</FormValidationMessage>
                )}
              <FormLabel>Grade</FormLabel>
              <FormInput
                onChangeText={text => setFieldValue('grade', text)}
                value={values.grade}
              />
              {touched.grade &&
                errors.grade && (
                  <FormValidationMessage>{errors.grade}</FormValidationMessage>
                )}
              <FormLabel>Total students</FormLabel>
              <FormInput
                onChangeText={text => setFieldValue('totalStudents', text)}
                value={values.totalStudents}
              />
              {touched.totalStudents &&
                errors.totalStudents && (
                  <FormValidationMessage>
                    {errors.totalStudents}
                  </FormValidationMessage>
                )}
              <View style={{ marginBottom: 30, marginTop: 20 }}>
                <Button
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  title="Submit"
                />
              </View>
            </ScrollView>
          )}
        />
      </View>
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
