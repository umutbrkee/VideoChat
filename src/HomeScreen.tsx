import React, {useEffect, useState} from 'react';
import {
  Platform,
  View,
  Button,
  TextInput,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../NavigationTypes';
import {acceptCall, makeCall, receiveCall, setIdentifier} from '../store/store';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [callTarget, setCallTarget] = useState('');
  const [identifier, setIdentifierState] = useState('');
  const incomingCall = useSelector((state: any) => state.call.incomingCall);

  useEffect(() => {
    const generateRandomId = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

    const id = generateRandomId();
    setIdentifierState(id);
    console.log(`Device Identifier: ${id}`);
    dispatch(setIdentifier(id));

    const url =
      Platform.OS === 'android'
        ? 'ws://192.168.1.37:8080'
        : 'ws://192.168.1.37:8080';
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = event => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      if (message.type === 'call' && message.data.target === id) {
        dispatch(
          receiveCall({
            target: message.data.target,
            caller: message.data.caller,
          }),
        );
      }
    };

    websocket.onerror = error => {
      console.error('WebSocket error:', error.message);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    if (incomingCall && incomingCall.target === identifier && ws) {
      Alert.alert('Incoming Call', `Call from ${incomingCall.caller}`, [
        {
          text: 'Accept',
          onPress: () => {
            dispatch(acceptCall({caller: incomingCall.caller}));
            console.log('Dispatching acceptcall');
            navigation.navigate('Call', {ws, identifier});
          },
        },
        {
          text: 'Reject',
          onPress: () => {
            dispatch(receiveCall(null));
          },
        },
      ]);
    }
  }, [incomingCall, ws]);

  const handleMakeCall = () => {
    if (ws) {
      const message = {
        type: 'call',
        data: {target: callTarget, caller: identifier},
      };
      ws.send(JSON.stringify(message));
      console.log('Dispatching makeCall action');
      dispatch(makeCall({target: callTarget}));
      navigation.navigate('Call', {ws, identifier});
    }
  };

  return (
    <View style={styles.container}>
      <Text>Your Identifier: {identifier}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter target username"
        value={callTarget}
        onChangeText={setCallTarget}
      />
      <Button title="CALL" onPress={handleMakeCall} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
