const {
    Sequelize,
    DataTypes
} = require('sequelize')
const betterSqlite3 = require('better-sqlite3')

// Créez une instance Sequelize avec les informations de connexion à votre base de données SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '.tmp/bataille.db', // Chemin vers votre fichier SQLite
    logging: false // Désactive le journal
});

// Définissez vos modèles (tables) ici
const Player = sequelize.define('Player', {
    // Définissez vos champs (colonnes) ici
    player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    player_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
    },
    player_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    player_hand: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
    },
    player_socket_id: {
        type: Sequelize.STRING(255),
        allowNull: true
    }
});

const Game = sequelize.define('Game', {
    // Définissez vos champs (colonnes) ici
    game_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    game_room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    game_current_player: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    game_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    game_winner_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

const Room = sequelize.define('Room', {
    // Définissez vos champs (colonnes) ici
    room_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    room_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
    },
    room_creator: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    room_number_of_cards: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

Game.hasOne(Room)
Room.belongsTo(Game)

Game.belongsToMany(Player, {through: "GamePlayers"})
Player.belongsToMany(Game, {through: "GamePlayers"})

// Initialisez votre base de données SQLite avec Better-SQLite3
const db = betterSqlite3('.tmp/bataille.db')



// Exportez l'instance Sequelize et vos modèles pour les utiliser ailleurs dans votre application
module.exports = {
  sequelize,
  db,
  Player,
  Game,
  Room
};