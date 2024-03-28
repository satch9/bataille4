import { useState, useContext } from "react";
import { Avatar, Button, List, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useUser } from "@clerk/clerk-react";

import PropTypes from "prop-types";

const RoomList = ({ rooms }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const { user } = useUser();

  const handleJoinRoom = (room) => {

    console.log(`Joining room ${room.room_name}`);
    setLoading(true);
    // Simulez une action de chargement pendant quelques secondes
    setTimeout(() => {
      setLoading(false);
      // Ajoutez ici le code pour rejoindre la salle
      socket.emit("joinRoom", {
        roomId: room.room_id,
        username: user.username,
      });
      navigate("/gameboard");
    }, 2000);
  };

  const renderItem = (room) => {
    //console.log("room roomlist", room);
    return (
      <List.Item
        actions={[
          <Button
            key="join"
            type="dashed"
            onClick={() => handleJoinRoom(room)}
            disabled={loading}
          >
            Rejoindre {loading && <Spin size="small" />}
          </Button>,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title={`${room.room_name}`}
          description={`Créateur: ${room.room_creator_name}`}
        ></List.Item.Meta>
      </List.Item>
    );
  };

  return (
    <List itemLayout="horizontal" dataSource={rooms} renderItem={renderItem} />
  );
};

RoomList.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      room_id: PropTypes.number,
      room_name: PropTypes.string,
      room_number_of_cards: PropTypes.number,
      room_creator: PropTypes.number,
      room_creator_name: PropTypes.string,
    }),
  ).isRequired,
};

export default RoomList;
