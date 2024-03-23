import { useState } from 'react'
import { Avatar, Button, List, Spin } from "antd"
import { UserOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const RoomList = ({ rooms }) => {
    const [loading, setLoading] = useState(false)
    
    const handleJoinRoom = (room) => {
        console.log(`Joining room ${room.name}`);
        setLoading(true);
    }

    const renderItem = (room) => {
        return (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${room.name}`}
                    description={`Créateur: ${room.creatorName}`}
                >
                    <Button onClick={() => handleJoinRoom(room)} type="primary">
                        Rejoindre &nbsp; {loading && <Spin size="small" />}
                    </Button>
                </List.Item.Meta>
            </List.Item>
        )
    }

    return (
        <List
            itemLayout="horizontal"
            dataSource={rooms}
            renderItem={renderItem}
        />
    )
}

RoomList.propTypes = {
    rooms: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            numCards: PropTypes.number.isRequired,
            creatorName: PropTypes.string.isRequired,
            roomId: PropTypes.number.isRequired,
            players: PropTypes.arrayOf(PropTypes.object).isRequired,
            lastCards: PropTypes.string,
        })
    ).isRequired,
};

export default RoomList