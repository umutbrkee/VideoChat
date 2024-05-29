This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

- Call ad video chat with other devices.
- Real-time video and audio streaming using WebRTC
- Manage camera and microphone permissions


## Step 1: Start  Server

First, you will need to start **Websocket**.

To start server, run the following commands:

```sh
git clone https://github.com/umutbrkee/VideoChat.git
cd VideoChat
```

```sh
cd server
```

```sh
npm install
```

```sh
node signaling-server.js
```

## Step 2: Install dependencies

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:


```sh
npm install
```
```sh
cd ios
```
```sh
pod install
```

If everything is set up _correctly_, Now you should give your local ip to ```'ws://YOUR-LOCAL-IP:8080'``` at necessary parts.


```
## Step 3: Modifying your App

Run your app using

```bash
npx react-native run-android

or

npx react-native run-ios

```

## Congratulations! :tada:

You've successfully run your React Native App. :partying_face:




# Demo Video

https://github.com/umutbrkee/VideoChat/assets/45608427/5cba8d25-f165-47cd-9b9e-7ff61bff723a



## Dependencies

- `react-native`
- `react-native-webrtc`
- `redux`
- `@reduxjs/toolkit`
- `redux-persist`
- `react-redux`

