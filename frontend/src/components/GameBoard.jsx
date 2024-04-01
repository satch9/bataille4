import { useContext, useEffect, useCallback } from "react"
import { SocketContext } from "../context/SocketContext"
import { message, Col, Row, Button } from "antd"
import { useSelector } from 'react-redux'
import { useParams } from "react-router-dom"

const GameBoard = () => {
    let { roomId } = useParams();
    const [messageApi, contextHolder] = message.useMessage()
    const socket = useContext(SocketContext)
    const game = useSelector(state => state.game)
    //const dispatch = useDispatch()

    const info = useCallback((text) => {
        messageApi.info(text);
    }, [messageApi])

    console.log("game", game)

    useEffect(() => {
        const handleJoinedRoom = (username) => {
            info(`Le joueur ${username} a rejoint la partie`)

            // On ajoute le nom du joueur à l'état de Redux pour que les composants enfants puissent accéder au nom

        }
        socket.on("player joined room", handleJoinedRoom)

        return () => {
            socket.off("player joined room", handleJoinedRoom)
        }
    }, [socket, info])

    const handleStartGame = () => {
        // Send a "start game" message to the server
        socket.emit("start game", (roomId));
    };

    return (
        <div className="game-board">
            {contextHolder}
            <Button type="primary" onClick={handleStartGame}>Débuter la partie</Button>

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
