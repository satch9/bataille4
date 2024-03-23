import { Avatar, Typography } from 'antd'
import { useUser } from '@clerk/clerk-react'
import PropTypes from 'prop-types'

const { Title, Text } = Typography;

const ScoreBoard = ({ players }) => {
    const { user } = useUser()

    console.log("user", user)

    return (<div className="scoreboard">
        {
            players.map((player, index) => (
                <div key={player.name + index} className="player-row">
                    <Avatar size={32} src={<img src={user.imageUrl} alt="avatar" />} />
                    <div className="player-info">
                        <Title level={4}>{player.name}</Title>
                        <Text type="secondary">Score: {player.score}</Text>
                    </div>
                </div>
            ))}
    </div>
    )
};

ScoreBoard.propTypes = {
    players: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
            score: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default ScoreBoard;