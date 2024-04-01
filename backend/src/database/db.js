const {
  Sequelize,
  DataTypes
} = require("sequelize");

// Créez une instance Sequelize avec les informations de connexion à votre base de données SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ".tmp/bataille.sqlite", // Chemin vers votre fichier SQLite
  logging: false, // Désactive le journal
});

// Définissez vos modèles (tables) ici
const Player = sequelize.define(
  "Player", {
    // Définissez vos champs (colonnes) ici
    player_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    player_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    player_socket_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    timestamps: true,
    createdAt: "player_createdAt",
    updatedAt: "player_updatedAt",
  },
);

const Game = sequelize.define(
  "Game", {
    // Définissez vos champs (colonnes) ici
    game_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    game_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    game_current_player: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    game_start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    game_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    game_winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    game_updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },{
    timestamps: false,
  }
);

const Room = sequelize.define(
  "Room", {
    // Définissez vos champs (colonnes) ici
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    room_creator: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    room_creator_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    room_number_of_cards: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true,
    createdAt: "room_createdAt",
    updatedAt: "room_updatedAt",
  },
);

/* Game.hasOne(Room)
Room.belongsTo(Game) */

const GamePlayers = sequelize.define(
  "GamePlayers", {
    gamePlayers_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    gamePlayer_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    gamePlayer_hand: {
      type: DataTypes.TEXT("medium"),
      allowNull: true,
    },
  }, {
    timestamps: true,
    createdAt: "gamePlayers_createdAt",
    updatedAt: "gamePlayers_updatedAt",
  },
);

Game.belongsToMany(Player, {
  through: "GamePlayers",
});
Player.belongsToMany(Game, {
  through: "GamePlayers",
});

// Exportez l'instance Sequelize et vos modèles pour les utiliser ailleurs dans votre application
module.exports = {
  sequelize,
  Player,
  Game,
  Room,
  GamePlayers,
};