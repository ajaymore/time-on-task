import React from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { graphql, gql } from 'react-apollo';
import { userQuery } from './Home';
import { Formik } from 'formik';
import Yup from 'yup';

class AddSchool extends React.Component {
  static navigationOptions = {
    title: 'Add a school entry',
    headerRight: <Button title="Details" onPress={() => alert('clicked')} />
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
      <View>
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
            <View>
              <TextInput
                onChangeText={text => setFieldValue('name', text)}
                value={values.name}
                placeholder="Name"
              />
              {touched.name && errors.name && <Text>{errors.name}</Text>}
              <TextInput
                onChangeText={text => setFieldValue('address', text)}
                value={values.address}
                multiline={true}
                numberOfLines={4}
                placeholder="Address"
              />
              {touched.address &&
                errors.address && <Text>{errors.address}</Text>}
              <TextInput
                onChangeText={text => setFieldValue('town', text)}
                value={values.town}
                placeholder="Town"
              />
              {touched.town && errors.town && <Text>{errors.town}</Text>}
              <Button
                onPress={handleSubmit}
                disabled={isSubmitting}
                title="Submit"
              />
            </View>
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
