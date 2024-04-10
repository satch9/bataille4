import { useContext, useEffect, useCallback } from "react"
import { SocketContext } from "../context/SocketContext"
import { message, Col, Row, Button } from "antd"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { actions as gameActions } from "../redux/reducers/gameReducer"
import PlayerHand from "./PlayerHand"


const GameBoard = () => {
    const { roomId } = useParams()
    const [messageApi, contextHolder] = message.useMessage()
    const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const game = useSelector(state => state.game)

    const info = useCallback((text) => {
        messageApi.info(text)
    }, [messageApi])



    useEffect(() => {
        const handleJoinedRoom = (data) => {
            console.log("data handlejoinedRoom : ", data)
            Object.keys(data).forEach(key => {
                console.log("key", key)
                if (key === "creator") {
                    info(`Le joueur ${data.creator.player_name} a rejoint la partie`)
                    dispatch(gameActions.setPlayers(data.creator.player_name))
                    dispatch(gameActions.setCreatorName(data.creator.player_name))
                }
                if (key === "opponent") {
                    info(`Le joueur ${data.opponent.player_name} a rejoint la partie`)
                    dispatch(gameActions.setPlayers(data.opponent.player_name))
                    /* dispatch(gameActions.setCreatorName(data.creator.player_name)) */
                    dispatch(gameActions.setOpponentName(data.opponent.player_name))
                }

                //socket.emit("updateGameState", game)
            })
        }

        const handleGameStarted = (data) => {
            console.log("started [handleGameStarted]", data.started)
            console.log("started [handleGameStarted]", data.currentPlayer)
            console.log("started [handleGameStarted]", data.cards)

            if (data.started) {
                info('La partie peut commencer')
                dispatch(gameActions.addCardsCreator(data.cards[0]))
                dispatch(gameActions.addCardsOpponent(data.cards[1]))
                dispatch(gameActions.setCurrentPlayer(data.currentPlayer))
                dispatch(gameActions.setTurn(data.currentPlayer))
                dispatch(gameActions.setPhase("jouer"))
                dispatch(gameActions.setGameStarted(data.started))
                dispatch(gameActions.setGameId(data.gameId))
                dispatch(gameActions.setRoomId(data.roomId))
            }
        }

        /* const handleUpdateGameState = (data) => {
            console.log("handleUpdateGameState: ", data)
        } */

        /* socket.on("updateGameState", handleUpdateGameState) */
        socket.on("player joined room", handleJoinedRoom)
        socket.on("game started", handleGameStarted)

        console.log("game", game)

        return () => {
            socket.off("player joined room", handleJoinedRoom)
            socket.off("game started", handleGameStarted)
            /* socket.off("updateGameState", handleUpdateGameState) */
        }
    }, [socket, info, dispatch, game.players, game])

    const handleStartGame = () => {
        // Send a "start game" message to the server
        socket.emit("start game", ({ roomId, players: game.players }))
    }

    return (
        <div className="game-board">
            {contextHolder}
            {
                game.creator && game.players.length == 2 && !game.gameStarted && (
                    <Button
                        type="primary"
                        onClick={handleStartGame}
                    >
                        Débuter la partie
                    </Button>
                )
            }


            {
                game.gameStarted && (
                    <>
                        <Row gutter={[8, 24]} style={{ marginBottom: '10px',height: "180px", }}>
                            <Col style={{ background: '#0092ff', paddingTop: '8px', paddingBottom: '8px' }}
                                xs={{ flex: '100%',  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                sm={{ flex: '50%', height: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                            >
                                <p>{game.creatorName || "Créateur"}</p>
                                <PlayerHand playerCards={game.cardsCreator} />

                            </Col>

                            <Col style={{ background: '#337299', paddingTop: '8px', paddingBottom: '8px' }}
                                xs={{ flex: '100%' }}
                                sm={{ flex: '50%' }}
                            >
                                <p>{game.opponentName}</p>
                                <PlayerHand playerCards={game.cardsOpponent} />
                            </Col>
                        </Row>
                        <Row gutter={[8, 24]}>
                            <Col style={{ background: '#0000ff', paddingTop: '8px', paddingBottom: '8px', height: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                xs={{ flex: '100%' }}

                            >
                                Board
                            </Col>
                        </Row>
                    </>
                )
            }


        </div>
    )
}

export default GameBoard
