import { useState } from "react";
import PropTypes from "prop-types";
import Card from "./Card";

const PlayerHand = ({ playerCards }) => {
  const [faceDownCards] = useState(playerCards);
  const [faceUpCards, setFaceUpCards] = useState([]);

  const handleDrawCard = () => {
    if (faceDownCards.length > 0) {
      const drawnCard = faceDownCards.pop();
      setFaceUpCards((prevCards) => [...prevCards, drawnCard]);
    }
  };

  const handleFlipCard = (index) => {
    const flippedCard = faceDownCards.splice(index, 1)[0];
    setFaceUpCards((prevCards) => [...prevCards, flippedCard]);
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

      <button onClick={handleDrawCard}>Draw Card</button>
    </div>
  );
};

PlayerHand.propTypes = {
  playerCards: PropTypes.arrayOf(
    PropTypes.shape({
      suit: PropTypes.oneOf(["Hearts", "Diamonds", "Clubs", "Spades"]).isRequired,
      value: PropTypes.oneOf(["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]).isRequired,
    })
  ).isRequired,
};

export default PlayerHand;