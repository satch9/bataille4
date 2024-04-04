const {
  sequelize
} = require("../database/db");

const Player = require("./Player");

class Room {
  constructor(name, numCards, creator) {
    this.room_name = name;
    this.room_creator = creator;
    this.room_number_of_cards = numCards;
    this.room_creator_name = "";
    this.room_players = null;
    this.room_lastCard = null;
  }

  async createRoomToDatabase() {
    try {
      let room = await Room.findRoomByName(this.room_name);
      //console.log("roomNameExist", roomNameExist)
      if (room.length === 0) {
        room = await sequelize.models.Room.create({
          room_name: this.room_name,
          room_creator: this.room_creator,
          room_number_of_cards: this.room_number_of_cards,
        });

      } else {
        room = room[0]
      }

      // Récupérer les détails du joueur créateur
      //console.log("this.room_creator", this.room_creator)
      const creatorDetails = await Player.findPlayerById(this.room_creator);
      //console.log("creatorDetails", creatorDetails)
      if (creatorDetails) {
        room.room_creator_name = creatorDetails.player_name;
        await room.save();
      } else {
        console.warn(
          "Impossible de trouver les détails du créateur de la salle.",
        );
      }
      //console.log("newRoom", newRoom)
      return room;

    } catch (error) {
      console.error(
        `Erreur lors de l'enregistrement de la salle ${this.room_name} dans la base de données :`,
        error,
      );
      throw error;
    }
  }

  static async findRoomByName(name) {
    let sql = "SELECT * FROM Rooms WHERE room_name=? ";
    const [results, metadata] = await sequelize.query(sql, {
      replacements: [name],
    });
    //console.log("results", results)
    //console.log("metadata", metadata)
    return results;
  }

  static async getAllRooms(callback) {
    try {
      const rows = sequelize.models.Room.findAll();
      rows
        .then((data) => callback(null, data))
        .catch((err) => callback(err, []));
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de toutes les salles :`,
        error,
      );
      callback(error);
    }
  }

  static async findRoomById(roomId) {
    try {
      let sql = "SELECT * FROM Rooms WHERE room_id=? ";
      const [results, metadata] = await sequelize.query(sql, {
        replacements: [roomId],
      });
      return results;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la salle avec l'id: ${roomId} :`,
        error,
      );
    }
  }
}

module.exports = Room;