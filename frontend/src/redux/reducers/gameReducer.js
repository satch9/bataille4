import {
    createSlice
} from '@reduxjs/toolkit'

const gameSlice = createSlice({
    name: "game",
    initialState: {
        gameId: null,
        roomId: null,
        playerName: "",
        creator: null,
        players: [],
        cardsCreator: [],
        cardsOpponent: [],
        gameStarted: false,
        turn: null,
        phase: null,
        currentPlayer: null,
    },
    reducers: {
        setGameId(state, action) {
            return {
                ...state,
                gameId: action.payload
            }
        },
        setRoomId(state, action) {
            return {
                ...state,
                roomId: action.payload
            }
        },
        setPlayerName(state, action) {
            return {
                ...state,
                playerName: action.payload
            }
        },
        setCreator(state, action) {
            state.creator = action.payload
            if (action.payload === true) {
                state.players.push(state.playerName);
            }
            /* else {
                           const index = state.players.indexOf(state.playerName);
                           if (index > -1) {
                               state.players.splice(index, 1);
                           }
                       } */
        },
        setPlayers(state, action) {
            return {
                ...state,
                players: action.payload
            }
        },
        addCardsCreator(state, action) {
            return {
                ...state,
                cardsCreator: action.payload
            }
        },
        addCardsOpponent(state, action) {
            return {
                ...state,
                cardsOpponent: action.payload
            }
        },
        setGameStarted(state, action) {
            return {
                ...state,
                gameStarted: action.payload
            }
        },
        setTurn(state, action) {
            return {
                ...state,
                turn: action.payload
            }
        },
        setPhase(state, action) {
            return {
                ...state,
                phase: action.payload
            }
        },
        setCurrentPlayer(state, action) {
            return {
                ...state,
                currentPlayer: action.payload
            }
        },
    },
})

export const {
    actions,
    reducer
} = gameSlice;

export const {
    setGameId,
    setPlayerName,
    setCreator,
    setPlayers,
    addCardsCreator,
    addCardsOpponent,
    setGameStarted,
    setTurn,
    setPhase,
    setCurrentPlayer
} = actions;

export default reducer;