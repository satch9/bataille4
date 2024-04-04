import { useContext, useEffect, useCallback, useState } from "react"
import { SocketContext } from "../context/SocketContext"
import { message, Col, Row, Button } from "antd"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { actions as gameActions } from "../redux/reducers/gameReducer"


const GameBoard = () => {
    const { roomId } = useParams()
    const [messageApi, contextHolder] = message.useMessage()
    const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const game = useSelector(state => state.game)
    const [isGameStarting, setIsGameStarting] = useState(false)

    const info = useCallback((text) => {
        messageApi.info(text)
    }, [messageApi])



    useEffect(() => {
        const handleJoinedRoom = (data) => {
            console.log("data handlejoinedRoom : ", data)
            info(`Le joueur ${data.player_name} a rejoint la partie`)
            dispatch(gameActions.setPlayers(data.player_name))
            socket.emit("updateGameState", game)
        }

        const handleGameStarted = () => {
            info('La partie peut commencer')
            dispatch(gameActions.setGameStarted(true))
        }

        const handleUpdateGameState = (data) => {
            console.log("handleUpdateGameState: ", data)
        }

        socket.on("updateGameState", handleUpdateGameState)
        socket.on("player joined room", handleJoinedRoom)
        socket.on("game started", handleGameStarted)

        console.log("game", game)

        return () => {
            socket.off("player joined room", handleJoinedRoom)
            socket.off("game started", handleGameStarted)
            socket.off("updateGameState", handleUpdateGameState)
        }
    }, [socket, info, dispatch, game.players, game])

    const handleStartGame = () => {
        // Send a "start game" message to the server
        setIsGameStarting(true)
        socket.emit("start game", (roomId))
    }

    return (
        <div className="game-board">
            {contextHolder}
            {
                game.creator && game.players.length == 2 && (
                    <Button
                        type="primary"
                        onClick={handleStartGame}
                        disabled={isGameStarting || game.gameStarted}
                    >
                        Débuter la partie
                    </Button>
                )
            }


            {
                game.gameStarted && (
                    <Row gutter={[8, 24]}>
                        <Col style={{ background: '#0092ff', paddingTop: '8px', paddingBottom: '8px' }}
                            xs={{ flex: '100%' }}
                            sm={{ flex: '50%' }}
                        >
                            Créateur
                        </Col>
                        <Col style={{ background: '#337299', paddingTop: '8px', paddingBottom: '8px' }}
                            xs={{ flex: '100%' }}
                            sm={{ flex: '50%' }}
                        >
                            Adversaire
                        </Col>
                    </Row>
                )
            }


        </div>
    )
}

export default GameBoard
