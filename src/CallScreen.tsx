import React, {useEffect, useRef, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCView,
} from 'react-native-webrtc';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CallScreenNavigationProp,
  CallScreenRouteProp,
} from '../NavigationTypes';
import {useDispatch, useSelector} from 'react-redux';
import {acceptCall, rejectCall, receiveCall} from '../store/store';

const CallScreen: React.FC = () => {
  const navigation = useNavigation<CallScreenNavigationProp>();
  const route = useRoute<CallScreenRouteProp>();
  const {ws, identifier} = route.params;
  const dispatch = useDispatch();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(true);
  const pc = useRef<RTCPeerConnection>(new RTCPeerConnection());
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://192.168.1.37:8080');

    wsRef.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    wsRef.current.onclose = () => {
      setIsCallActive(false);
    };

    wsRef.current.onmessage = message => {
      const data = JSON.parse(message.data);

      if (data.type === 'offer') {
        handleReceiveOffer(data.offer);
      } else if (data.type === 'answer') {
        handleReceiveAnswer(data.answer);
      } else if (data.type === 'candidate') {
        handleReceiveCandidate(data.candidate);
      }
    };

    const startCall = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);

        stream.getTracks().forEach(track => {
          pc.current.addTrack(track, stream);
        });

        (pc as any).current.ontrack = (event: any) => {
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
            console.log('Remote Stream added', event.streams[0]);
          }
        };

        (pc as any).current.onicecandidate = (event: any) => {
          if (event.candidate) {
            wsRef.current?.send(
              JSON.stringify({type: 'candidate', candidate: event.candidate}),
            );
          }
        };

        const offer = await (pc as any).current.createOffer();
        await pc.current.setLocalDescription(offer);
        wsRef.current?.send(
          JSON.stringify({type: 'offer', offer: pc.current.localDescription}),
        );
      } catch (e) {
        console.error(e);
      }
    };

    const handleReceiveOffer = async (offer: RTCSessionDescription) => {
      try {
        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        wsRef.current?.send(
          JSON.stringify({type: 'answer', answer: pc.current.localDescription}),
        );
      } catch (e) {
        console.error(e);
      }
    };

    const handleReceiveAnswer = async (answer: RTCSessionDescription) => {
      try {
        await pc.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
      } catch (e) {
        console.error(e);
      }
    };

    const handleReceiveCandidate = async (candidate: RTCIceCandidate) => {
      try {
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error(e);
      }
    };

    startCall();

    return () => {
      pc.current.close();
      wsRef.current?.close();
      localStream?.getTracks().forEach(track => track.stop());
      remoteStream?.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setRemoteStream(null);
    };
  }, []);

  const hangUpCall = () => {
    pc.current.close();
    wsRef.current?.close();
    setIsCallActive(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.rtcView} />
      )}
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.rtcView} />
      )}
      {isCallActive && <Button title="Hang Up" onPress={hangUpCall} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  rtcView: {
    width: '100%',
    height: '50%',
  },
});

export default CallScreen;
