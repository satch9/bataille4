const { sequelize } = require('../database/db')

const Player = require('./Player')

class Room {
  constructor() {
    this.room_name = null
    this.room_creator = null
    this.room_number_of_cards = null
    this.room_creator_name = ''
    this.room_players = null
    this.room_lastCard = null
  }

  async createRoomToDatabase(name, numCards, creator) {
    try {
      let room = await Room.findRoomByName(name)
      //console.log("roomNameExist", roomNameExist)
      if (room.length === 0) {
        room = await sequelize.models.Room.create({
          room_name: name,
          room_creator: creator,
          room_number_of_cards: numCards,
        })
      } else {
        room = room[0]
      }

      // Récupérer les détails du joueur créateur
      //console.log("this.room_creator", this.room_creator)
      const creatorDetails = await Player.findPlayerById(creator)
      //console.log("creatorDetails", creatorDetails)
      if (creatorDetails) {
        room.room_creator_name = creatorDetails.player_name
        await room.save()
      } else {
        console.log(
          'Impossible de trouver les détails du créateur de la salle.',
        )
      }
      //console.log("newRoom", newRoom)
      return room
    } catch (error) {
      console.error(
        `Erreur lors de l'enregistrement de la salle ${this.room_name} dans la base de données :`,
        error,
      )
      throw error
    }
  }

  static async findRoomByName(name) {
    try {
      const results = await sequelize.models.Room.findAll({
        where: {
          room_name: name,
        },
      })
      return results
    } catch (error) {
      console.error(
        `Erreur lors de la recherche de la salle par nom ${name} :`,
        error,
      )
      throw error
    }
  }

  static async getAllRooms(callback) {
    try {
      const rows = sequelize.models.Room.findAll()
      rows
        .then((data) => callback(null, data))
        .catch((err) => callback(err, []))
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de toutes les salles :`,
        error,
      )
      callback(error)
    }
  }

  static async findRoomById(roomId) {
    try {
      const room = await sequelize.models.Room.findByPk(roomId)
      return room
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la salle avec l'id: ${roomId} :`,
        error,
      )
      throw error
    }
  }
}

module.exports = Room
