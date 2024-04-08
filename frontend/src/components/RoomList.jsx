import { useState, useContext } from "react";
import { Avatar, Button, List, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from 'react-redux'
import { actions as gameActions } from "../redux/reducers/gameReducer"

import PropTypes from "prop-types";

const RoomList = ({ rooms }) => {
  const [loadingState, setLoadingState] = useState({});
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const { user } = useUser();
  const dispatch = useDispatch();
  const game = useSelector(state => state.game)

  const handleJoinRoom = (room) => {

    console.log("Joining room", JSON.stringify(room));
    setLoadingState((prevState) => ({
      ...prevState,
      [room.room_id]: true, // Définir l'état de chargement pour cet élément de la liste
    }));
    // Simulez une action de chargement pendant quelques secondes
    setTimeout(() => {
      setLoadingState((prevState) => ({
        ...prevState,
        [room.room_id]: false, // Définir l'état de chargement pour cet élément de la liste
      }));
      dispatch(gameActions.setPlayers([...game.players, user.username]));
      dispatch(gameActions.setRoomId(room.room_id))
      // Ajoutez ici le code pour rejoindre la salle
      socket.emit("joinRoom", {
        roomId: room.room_id,
        username: user.username,
      });
      navigate(`/gameboard/${room.room_id}`);
    }, 2000);
  };

  const renderItem = (room) => {
    //console.log("room roomlist", room);
    const isLoading = loadingState[room.room_id] || false
    return (
      <List.Item
        actions={[
          <Button
            key="join"
            type="dashed"
            onClick={() => handleJoinRoom(room)}
            disabled={isLoading}
          >
            Rejoindre {isLoading && <Spin size="small" />}
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
