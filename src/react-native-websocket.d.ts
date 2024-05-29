// src/react-native-websocket.d.ts
declare module 'react-native-websocket' {
    import { Component } from 'react';
    import { WebSocketEventHandlers, WebSocketState } from 'react-native';

    interface WebSocketProps {
        url: string;
        onOpen?: (event: Event) => void;
        onMessage?: (event: MessageEvent) => void;
        onError?: (event: Event) => void;
        onClose?: (event: CloseEvent) => void;
        reconnect?: boolean;
        reconnectInterval?: number;
        reconnectAttempts?: number;
    }

    class WebSocket extends Component<WebSocketProps> {
        [x: string]: (event: any) => void;
        send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void;
        close(code?: number, reason?: string): void;
        readyState: WebSocketState;
    }

    export { WebSocket };
}
