const {
  db,
  sequelize
} = require("../database/db");

class Player {
  constructor(player_socket_id, player_name) {
    this.player_id = null;
    this.player_name = player_name;
    this.player_socket_id = player_socket_id;
  }

  async saveCreatorToDatabase() {
    try {
      let player = await Player.findPlayerByName(this.player_name);
      //console.log("playerNameExist", playerNameExist)
      if (player.length === 0) {
         player = await sequelize.models.Player.create({
          player_name: this.player_name,
          player_socket_id: this.player_socket_id,
        });
        //console.log("newPlayer", newPlayer)
      } else {
        console.warn("Joueur existant dans la base. On crée sa salle.");
        console.log("playerNameExist", player)
        player = player[0]
      }
      return player;
    } catch (error) {
      console.error(
        `Erreur lors de l'enregistrement du joueur ${this.player_name} dans la base de données :`,
        error,
      );
      throw error;
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
    const [results, metadata] = await sequelize.query(
      "SELECT * FROM Players WHERE player_name=? ", {
        replacements: [name],
      },
    );
    //console.log("results", results)
    //console.log("metadata", metadata)
    return results;
  }

  static async findPlayerById(id) {
    try {
      const player = await sequelize.models.Player.findByPk(id);
      return player;
    } catch (error) {
      console.error(
        `Erreur lors de la recherche du joueur par ID ${id} :`,
        error,
      );
      throw error;
    }
  }

  static async findPlayerBySocketId(socketId) {
    try {
      const [results, metadata] = await sequelize.query(
        "SELECT * FROM Players WHERE player_socket_id=? ", {
          replacements: [socketId],
        },
      );
    } catch (error) {
      console.error(
        `Erreur lors de la recherche du joueur par socketId ${socketId} :`,
        error,
      );
      throw error;
    }
  }
}

module.exports = Player;