import PropTypes from "prop-types";

const Card = ({ suit, value, isFaceDown, onClick }) => {
  //console.log("isFaceDown", isFaceDown)

  function findSymbol(suitLetter){

    if (suitLetter === "Clubs") {
      return "../assets/Clubs.png"
    }
    if (suitLetter === "Diamonds") {
      return "../assets/Diamonds.png"
    }
    if (suitLetter === "Hearts") {
      return "../assets/Hearts.png"
    }
    if (suitLetter === "Spades") {
      return "../assets/Spades.png"
    }

  }

  const cardStyles = {
    width: "63px",
    height: "80px",
    borderRadius: "5px",
    cursor: "pointer",
    position: "absolute",
    left: "5px",
    // Ajustez la position pour l'empilement
    top: isFaceDown ? "50px" : "0", // Ajustez la position pour l'empilement
    zIndex: isFaceDown ? "0" : "1", // Pour placer la carte face visible au-dessus
    transform: isFaceDown ? "rotateY(180deg)" : "none", // Rotation de la carte si face cachée
    backgroundImage: `url(${isFaceDown ? "../assets/js-badge.svg" : findSymbol(suit)})`, // Arrière-plan basé sur la face de la carte
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    
  }

  const valueStyles = {
    position: "absolute",
    fontSize: "15px",
    fontWeight: "bold",
    color: "white",
    textAlign: "center", // Centre le texte horizontalement
    width: "100%", // Utilise la largeur complète de l'élément parent
    top: "50%", // Place le texte au milieu verticalement
    transform: "translateY(-50%)", // Déplace le texte vers le haut de 50% de sa propre hauteur
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
  isFaceDown: PropTypes.bool,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  onClick: () => { },
};

export default Card;
