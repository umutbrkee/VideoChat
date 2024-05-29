import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CallState {
  identifier: string | null;
  call: any;
  incomingCall: any;
  caller: string | null;
}

const initialState: CallState = {
  identifier: null,
  call: null,
  incomingCall: null,
  caller: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setIdentifier(state, action: PayloadAction<string>) {
      state.identifier = action.payload;
    },
    makeCall(state, action: PayloadAction<any>) {
      console.log('mararlabarba');
      state.call = action.payload;
    },
    receiveCall(state, action: PayloadAction<any>) {
      state.incomingCall = action.payload;
    },
    acceptCall(state, action: PayloadAction<any>) {
      state.caller = action.payload.caller;
    },
    rejectCall(state) {
      state.incomingCall = null;
    },
  },
});

export const { setIdentifier, makeCall, receiveCall, acceptCall, rejectCall } = callSlice.actions;

const store = configureStore({
  reducer: {
    call: callSlice.reducer,
  },
});

export default store;
