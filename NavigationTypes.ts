import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Call: { ws: WebSocket; identifier: string };
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type CallScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Call'>;

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type CallScreenRouteProp = RouteProp<RootStackParamList, 'Call'>;
