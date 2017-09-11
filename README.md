# Emotional Support Helpline Directory
A cross-platform, react native application for emotional crisis / suicide prevention in India.

The android version of this application is available on the Play store here: 
**https://play.google.com/store/apps/details?id=com.mhtech.in.helplineapp**

Website with more information on this is here: **https://mhtech.in**

This is my first React Native App and took about 2 weeks to put together including time spent to learn React Native using a number of React Native tutorials online (so please be gentle with feedback).

## How to build and start on Android

#### Do you have React Native installed?
Make sure you have react-native installed on your machine with node.js
Instructions here: https://facebook.github.io/react-native/docs/getting-started.html

#### Android Studio
Download from here: https://developer.android.com/studio/

#### Steps
**1. cd into the src folder**
```
cd src
```

**2. Install all the required packages**
```
npm install
```

**3. Install react-native-contacts**
```
npm install react-native-contacts
react-native link react-native-contacts
```

**4. Install react-native-communications**
```
npm install react-native-communications
```

**5. Start the React Native Project**
```
react-native run-android
```

**6. Open project in Android Studio**
1. Start `Android Studio` and open the `src/android` folder
2. Run the necessary updates to get project synced (Android studio will prompt you with updates)
3. Run the project by clicking the Play icon on top (you may need to define a Simulator)

## Pull Requests
Looking forward to pull requests on how we can make the app better and include best practices.

## Notes
1. I have removed all the key files used to sign the project and generate the apks. Please find the tutorial here: https://facebook.github.io/react-native/docs/signed-apk-android.html incase you want to generate keys and create an apk for yourself.
2. The contacts functionality (where you pull in the device's contact list) is a slow process (I need to better do it) and we have reports of it crashing the app if you have more than 2,000 contacts.
3. I have also removed the online URLs which are used to push updates to the device for the data for security reasons.
4. I have also deleted all the **build** projects to reduce the size of this repository.