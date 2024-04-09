import PropTypes from "prop-types";
import faceDownImage from "../assets/js-badge.svg";

const Card = ({ suit, value, isFaceDown, onClick }) => {
  const cardStyles = {
    width: "20px",
    height: "28px",
    border: "1px solid black",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px",
    backgroundColor: isFaceDown ? `url(${faceDownImage})` : `var(--${suit})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: isFaceDown ? "pointer" : "auto",
  };

  const valueStyles = {
    fontSize: "10px",
    fontWeight: "bold",
    color: "white",
  };

  return (
    <div style={cardStyles} onClick={onClick}>
      {!isFaceDown && <div style={valueStyles}>{value}</div>}
    </div>
  );
};

Card.propTypes = {
  suit: PropTypes.oneOf(["Hearts", "Diamonds", "Clubs", "Spades"]).isRequired,
  value: PropTypes.oneOf(["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]).isRequired,
  isFaceDown: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  onClick: () => {},
};

export default Card;