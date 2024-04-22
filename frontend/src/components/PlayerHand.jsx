import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext"
//import PropTypes from "prop-types";
import Card from "./Card";
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '@clerk/clerk-react'
import { setCurrentPlayer } from "../redux/reducers/gameReducer";

const PlayerHand = () => {
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game);
  const creator = game.creatorName;
  const creatorCards = game.cardsCreator;
  const opponent = game.opponentName;
  const opponentCards = game.cardsOpponent;
  const currentPlayer = game.currentPlayer;
  const { user } = useUser()
  const socket = useContext(SocketContext)

  const [faceDownCards, setFaceDownCards] = useState([]);
  const [faceUpCards, setFaceUpCards] = useState([]);
  //const game = useSelector(state => state.game)



  useEffect(() => {
    if (currentPlayer === user.username && currentPlayer === creator) {
      setFaceDownCards(creatorCards);
      setFaceUpCards([]);
    } else {
      setFaceDownCards(opponentCards);
      setFaceUpCards([]);
    }

    socket.on("flipped-card", ({ roomId, card, player, socketId, opponent }) => {
      console.log("roomId", roomId)
      console.log("card", card)
      console.log("player", player)
      console.log("socketId", socketId)
      console.log("opponent", opponent)
    })

  }, [currentPlayer, creator, creatorCards, opponentCards, user.username, socket])

  const handleFlipCard = (index) => {
    if (faceDownCards.length === 0) {
      setFaceDownCards(faceUpCards);
      setFaceUpCards([]);
    } else {
      const cardToFlip = faceDownCards[index];
      const newFaceDownCards = faceDownCards.slice();
      newFaceDownCards.splice(index, 1);
      setFaceDownCards(newFaceDownCards);
      setFaceUpCards((prevCards) => [...prevCards, cardToFlip]);

      if (currentPlayer === user.username) {
        socket.emit("flip-card", {
          roomId: game.roomId,
          card: cardToFlip,
          player: user.username,
          opponent: opponent,
        });
        dispatch(setCurrentPlayer(currentPlayer === opponent ? creator : opponent))
      }
    }
  };

  return (
    <div className="player-hand">
      <div className="face-down-pile">
        {faceDownCards.map((card, index) => (
          <Card
            key={index}
            suit={card.suit}
            value={card.value}
            isFaceDown={true}
            onClick={() => handleFlipCard(index)}
          />
        ))}
      </div>

      <div className="face-up-pile">
        {faceUpCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

    </div>
  );
};

/* PlayerHand.propTypes = {
  playerCards: PropTypes.arrayOf(
    PropTypes.shape({
      suit: PropTypes.oneOf(["Hearts", "Diamonds", "Clubs", "Spades"]).isRequired,
      value: PropTypes.oneOf(["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]).isRequired,
    })
  ).isRequired,
}; */

export default PlayerHand;