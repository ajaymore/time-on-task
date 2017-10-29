# Tech stack

## Front End

- react, react-native, react-native-elements, react-navigation | UI frameworks
- momentjs | Time manipulation
- react-apollo | GraphQL Service Layer
- redux, redux-observables, rxjs, redux-persist | State management
- formik | Managing UI forms
- react-native-google-signin | Google Sign in functionality
- utilities | jwt-decode, lodash, yup

## Server

- Nodejs 8.7
- MVC | express
- Services | REST - express, GraphQL - apollo-server-express, graphql-tools
- Google Oauth Authentication
- Authentication | passportjs
- Database | mongodb, mongoose
- Server Machine | Unbuntu 16.04


# Features

## Screens

- [X] User Login
- [X] School List
    - [X] Can View List of schools (owned, shared, contributing)
    - [X] Has a add collaborator icon for owned schools
    - [X] Clicking on list item should lead to class list
    - [X] Can add a new school from here
    - [ ] Edit link leads to edit school screen
    - [ ] Delete link warns and deletes the school on prompt
- [X] Add Collaboration
    - [X] Can search a user by email Id
    - [X] Choose between Shared and Contributor (default Shared)
- [X] Class list
    - [X] Display list of all associated classes with the school
    - [X] Show Add Class button if the school is owned
    - [X] Show brief school information
    - [X] Clicking list item should dispaly the observation list
    - [X] Edit link leads to edit school screen
    - [X] Delete link warns and deletes the school on prompt
- [X] Observation list
    - [X] Show add observation button if either owner or contributor
    - [X] displays all the observations collected so far
- [X] Add School
    - [X] Form to add a new school
- [ ] Edit School
    - [ ] Form to edit a new school
- [X] Add Class
    - [X] Form to add a new class
- [ ] Edit Class
    - [ ] Form to edit a new class
- [X] Observation Recorder inteface
    - [X] Virtual groups inteface to record


## Development Setup
- mongodb 3.4.9, nodejs 8.7 installed, yarn installed
- sudo yarn global add babel-cli nodemon
- git clone https://github.com/ajaymore/time-on-task.git
- change server/.env.example to server/.env
- Follow below steps to get google client secret and id
    - Visit https://cloud.google.com/console/project
    - Click on the **Select a project** dropdown
    - Create a new project or choose existing one
    - Click the hamburger icon on the top left and choose **APIs & services**
    - Click on library > Searc **Google plus** and enable the api
    - Click manage to return to the APIs & services dashboard
    - Click on Credentials
    - Click on **Create credentials** > OAuth client ID > Web Application
    - **Authorized Javascript origins**: http://localhost:8000
    - **Authorized redirect URI**: http://localhost:8000/auth/google/callback
    - Click on **Create Client**

- Follow below steps to set google authentication in the app

- Follow steps at https://github.com/devfd/react-native-google-signin/blob/master/android-guide.md

### google-services.json

- Development

```
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```
- to get google-services.json for use in android project
- vist https://developers.google.com/identity/sign-in/android/start-integrating
- choose project name, type package name (in.ajaymore.tot)

- Production
- Create new Android project, opt for Google signing of app, get the SHA-1 code
- vist https://developers.google.com/identity/sign-in/android/start-integrating
- choose project name, type package name (in.ajaymore.tot)

- create two configuration files for development and production
- put the google-services.json for development at app/src/debug and production google-services.json at app/ and app/release


- update the versionCode in android/app/build.gradle before each deploy and then build the application
- follow the steps at https://facebook.github.io/react-native/docs/signed-apk-android.html to generate build
- create passwords using `openssl rand -base64 14` and `pwgen -s 25`
- download an icon - use https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html to generate launcher icons and place them in res folder
- take two app screenshots on phone
- create quick privacy policy on github

```
    **Note:** When you ready to deploy to production don't forget to
    add your new url to *Authorized Javascript origins* and *Authorized redirect URI*,
    e.g. `http://my-awesome-app.herokuapp.com` and
    `http://my-awesome-app.herokuapp.com/auth/google/callback` respectively.
    The same goes for other providers.
```

- open mobile-client in android studio
- move to new package, update package name in AndroidManifest.xml
- Check every gradle file and make appropriate changes.
- update project name in index.js and package.json
- ctrl + shift + f => change all the instance of old package name


## Deployment preperation


## Username password login
- Register screen > onsubmit > send verification email > set emailVerified = false
- on login if emailVerify = false show pending screen