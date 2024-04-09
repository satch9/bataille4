import { createSlice } from '@reduxjs/toolkit'

const initialState ={
  gameId: null,
  roomId: null,
  creatorName: '',
  opponentName:'',
  creator: null,
  players: [],
  cardsCreator: [],
  cardsOpponent: [],
  gameStarted: false,
  turn: null,
  phase: null,
  currentPlayer: null,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameId(state, action) {
      return {
        ...state,
        gameId: action.payload,
      }
    },
    setRoomId(state, action) {
      return {
        ...state,
        roomId: action.payload,
      }
    },
    setCreatorName(state, action) {
      return {
        ...state,
        creatorName: action.payload,
      }
    },
    setOpponentName(state, action) {
      return {
        ...state,
        opponentName: action.payload,
      }
    },
    setCreator(state, action) {
      return {
        ...state,
        creator: action.payload,
      }
    },
    setPlayers(state, action) {
      let newPlayers
      if (Array.isArray(action.payload)) {
        const uniquePlayers = action.payload.filter(
          (player) => !state.players.includes(player),
        )
        newPlayers = [...state.players, ...uniquePlayers]
      } else {
        if (!state.players.includes(action.payload)) {
          newPlayers = [...state.players, action.payload]
        } else {
          newPlayers = state.players
        }
      }
      return {
        ...state,
        players: newPlayers,
      }
    },
    addCardsCreator(state, action) {
      return {
        ...state,
        cardsCreator: action.payload,
      }
    },
    addCardsOpponent(state, action) {
      return {
        ...state,
        cardsOpponent: action.payload,
      }
    },
    setGameStarted(state, action) {
      return {
        ...state,
        gameStarted: action.payload,
      }
    },
    setTurn(state, action) {
      return {
        ...state,
        turn: action.payload,
      }
    },
    setPhase(state, action) {
      return {
        ...state,
        phase: action.payload,
      }
    },
    setCurrentPlayer(state, action) {
      return {
        ...state,
        currentPlayer: action.payload,
      }
    },
    resetGame() {
      return gameSlice.initialState
    },
  },
})

export const { actions, reducer } = gameSlice

export const {
  setGameId,
  setRoomId,
  setCreatorName,
  setOpponentName,
  setCreator,
  setPlayers,
  addCardsCreator,
  addCardsOpponent,
  setGameStarted,
  setTurn,
  setPhase,
  setCurrentPlayer,
  resetGame,
} = actions

export default reducer
