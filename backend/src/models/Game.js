const { sequelize } = require('../database/db')

class Game {
  constructor() {
    this.game_id = null
    this.game_room_id = null
    this.game_current_player = null
    this.game_start_date = null
    this.game_end_date = null
    this.game_winner_id = null
    this.game_updated_date = null
  }

  async createGameToDatabase(game_room_id) {
    try {
      let newGame = await sequelize.models.Game.create({
        game_room_id: game_room_id,
      })
      this.game_id = newGame.game_id
      this.game_room_id = newGame.game_room_id

      return newGame
    } catch (error) {
      console.error(
        `Erreur lors de l'enregistrement de la partie ${this.game_id} dans la base de données :`,
        error,
      )
      throw error
    }
  }

  async startGame(players) {
    this.setStartDate()
    this.setCurrentPlayer(players)

    console.log(
      `The game has started! Current player is ${this.getCurrentPlayer()}`,
    )
  }

  async setStartDate() {
    const dateNow = new Date()
    this.game_start_date = dateNow
    this.game_updated_date = dateNow
    await sequelize.models.Game.update(
      {
        game_start_date: this.game_start_date,
        game_updated_date: this.game_updated_date,
      },
      { where: { game_id: this.game_id } },
    )
  }

  async setCurrentPlayer(players) {
    this.game_current_player = Math.random() >= 0.5 ? players[0] : players[1]

    await sequelize.models.Game.update(
      {
        game_current_player: this.game_current_player,
      },
      { where: { game_id: this.game_id } },
    )
  }

  async getCurrentPlayer() {
    try {
      let currentPlayer = await sequelize.models.Game.findOne({
        where: { game_id: this.game_id },
      }).then((data) => (this.game_current_player = data.game_current_player))
      return currentPlayer
    } catch (error) {
      console.log(
        `Erreur lors de la récupération du joueur en cours ${this.game_current_player} :`,
        error,
      )
      throw error
    }
  }

  getTimePlayed() {
    if (!this.game_start_date) return 0
    else {
      const timeDiff = Math.abs(
        new Date().getTime() - this.game_start_date.getTime(),
      )
      return parseInt(timeDiff / 1000) // returns time in seconds
    }
  }
}

module.exports = Game
