import { useContext, useEffect, useCallback } from "react"
import { SocketContext } from "../context/SocketContext"
import { message, Col, Row } from "antd"

const GameBoard = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const socket = useContext(SocketContext);

    const info = useCallback((text) => {
        messageApi.info(text);
    }, [messageApi])

    useEffect(() => {
        socket.on("player joined room", (username) => {
            info(`Le joueur ${username} a rejoint la partie`)
        })
    }, [socket, info])

    return (
        <div className="game-board">
            {contextHolder}
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
        </div>
    )
}

export default GameBoard
