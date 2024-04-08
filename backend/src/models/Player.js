const { sequelize } = require('../database/db')

class Player {
  constructor() {
    this.player_id = null
    this.player_name = null
    this.player_socket_id = null
  }

  async saveCreatorToDatabase(player_socket_id, player_name) {
    try {
      let player = await Player.findPlayerByName(player_name)
      //console.log("playerNameExist", playerNameExist)
      if (player.length === 0) {
        player = await sequelize.models.Player.create({
          player_name: player_name,
          player_socket_id: player_socket_id,
        })
        //console.log("newPlayer", newPlayer)
      } else {
        console.warn('Joueur existant dans la base. On crée sa salle.')
        console.log('playerNameExist', player)
        player = player[0]
      }
      this.player_id = player.player_id
      this.player_name = player.player_name
      this.player_socket_id = player.player_socket_id

      return player
    } catch (error) {
      console.error(
        `Erreur lors de l'enregistrement du joueur ${this.player_name} dans la base de données :`,
        error,
      )
      throw error
    }
  }

  static async addPlayer(name, socketId) {
    try {
      let newPlayerIntoRoom = await sequelize.models.Player.create({
        player_name: name,
        player_socket_id: socketId,
      })
      await newPlayerIntoRoom.save()
      //console.log(JSON.stringify(newPlayerIntoRoom, null, 4))
      return newPlayerIntoRoom
    } catch (error) {
      console.error(
        `Erreur lors de l'enregistrement dans la base de données de la table GamePlayers :`,
        error,
      )
      throw error
    }
  }

  static async findPlayerByName(name) {
    try {
      const [results, metadata] = await sequelize.query(
        'SELECT * FROM Players WHERE player_name=? ',
        {
          replacements: [name],
        },
      )
      //console.log("results", results)
      //console.log("metadata", metadata)
      return results
    } catch (error) {
      console.error(
        `Erreur lors de la recherche du joueur par nom ${name} :`,
        error,
      )
      throw error
    }
  }

  static async findPlayerById(id) {
    try {
      const player = await sequelize.models.Player.findByPk(id)
      return player
    } catch (error) {
      console.error(
        `Erreur lors de la recherche du joueur par ID ${id} :`,
        error,
      )
      throw error
    }
  }

  static async findPlayerBySocketId(socketId) {
    try {
      const results = await sequelize.models.Player.findAll({
        where: {
          player_socket_id: socketId,
        },
      })
      return results
    } catch (error) {
      console.error(
        `Erreur lors de la recherche du joueur par socketId ${socketId} :`,
        error,
      )
      throw error
    }
  }
}

module.exports = Player
