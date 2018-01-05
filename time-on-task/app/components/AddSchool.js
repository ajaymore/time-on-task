import React from 'react';
import { Text, View, TextInput, ScrollView } from 'react-native';
import { graphql, gql } from 'react-apollo';
import { userQuery } from './Home';
import { Formik } from 'formik';
import Yup from 'yup';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements';

class AddSchool extends React.Component {
  static navigationOptions = {
    title: 'Add a school entry'
  };

  _create = async ({ address, name, town }, cb) => {
    try {
      const mutationResult = await this.props.mutate({
        variables: {
          input: {
            address,
            name,
            town
          }
        },
        refetchQueries: [{ query: userQuery }]
      });
      const { goBack } = this.props.navigation;
      goBack();
      cb(null);
    } catch (err) {
      cb(err);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Formik
          initialValues={{
            name: '',
            address: '',
            town: ''
          }}
          /* validate={this._validate} */
          validationSchema={() =>
            Yup.object().shape({
              name: Yup.string()
                .required('Name is required!')
                .min(2)
                .max(60),
              address: Yup.string().required('Address is required!'),
              town: Yup.string().required('Town or city is required!')
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
              <FormLabel>School Name</FormLabel>
              <FormInput
                onChangeText={text => setFieldValue('name', text)}
                value={values.name}
              />
              {touched.name &&
                errors.name && (
                  <FormValidationMessage>{errors.name}</FormValidationMessage>
                )}
              <FormLabel>Address</FormLabel>
              <FormInput
                onChangeText={text => setFieldValue('address', text)}
                value={values.address}
                multiline={true}
                blurOnSubmit={false}
                numberOfLines={4}
              />
              {touched.address &&
                errors.address && (
                  <FormValidationMessage>
                    {errors.address}
                  </FormValidationMessage>
                )}
              <FormLabel>Town</FormLabel>
              <FormInput
                onChangeText={text => setFieldValue('town', text)}
                value={values.town}
              />
              {touched.town &&
                errors.town && (
                  <FormValidationMessage>{errors.town}</FormValidationMessage>
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

const createSchool = gql`
  mutation createSchool($input: SchoolInput!) {
    createSchool(input: $input) {
      address
      id
      name
      town
      createdAt
      updatedAt
    }
  }
`;

export default graphql(createSchool)(AddSchool);
