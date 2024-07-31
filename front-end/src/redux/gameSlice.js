import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    // messages
    messages: null,

    // information in room
    roomInfor: null,
  },

  reducers: {
    showMessages: (state, action) => {
      state.messages = action.payload;
    },
    setRoomInfor: (state, action) => {
      state.roomInfor = action.payload;
    },
  },
});

export const { showMessages, setRoomInfor } = gameSlice.actions;

export default gameSlice.reducer;
