const { sequelize } = require('../database/db')
const Deck = require('./Deck')
const Room = require('./Room')

class GamePlayers {
  constructor() {
    this.gamePlayers_GameGameId = null
    this.gamePlayers_PlayerPlayerId = null
    this.gamePlayers_score = 0
    this.gamePlayers_hand = null
  }

  async createGamePlayersToDatabase(gameId, playerId) {
    try {
      let newGamePlayers = await sequelize.models.GamePlayers.create({
        GameGameId: gameId,
        PlayerPlayerId: playerId,
      })
      return newGamePlayers
    } catch (error) {
      console.error(
        `Erreur lors de l'enregistrement dans la base de données de la table GamePlayers :`,
        error,
      )
      throw error
    }
  }

  static async addPlayerToRoom(roomid, player) {
    try {
      let newPlayerIntoRoom = await sequelize.models.GamePlayers.create({
        GameGameId: roomid,
        PlayerPlayerId: player.player_id,
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

  async start(roomId) {
    try {
      let gameplayers = await this.getAllFromGame(roomId)
      let numberOfCards = await Room.findRoomById(roomId)
      console.log('numberOfCards', numberOfCards)
      let deck = new Deck(numberOfCards.room_number_of_cards)
      let handsPlayers = deck.deal()
      //console.log('handsPlayers [GamePlayers]', handsPlayers)

      for (let index = 0; index < gameplayers.length; index++) {
        let gameplayer = gameplayers[index]

        if (gameplayer.gamePlayer_hand === null) {
          if (index === 0) {
            gameplayer.gamePlayer_hand = handsPlayers[0]
          }
          if (index === 1) {
            gameplayer.gamePlayer_hand = handsPlayers[1]
          }
          //console.log('gameplayer', gameplayer)
          await gameplayer.save()
        }
      }

      return handsPlayers
    } catch (error) {
      console.log(
        `Erreur lors du démarrage du jeu pour la salle ${roomId} :`,
        error,
      )
      throw error
    }
  }

  async getAllFromGame(roomId) {
    try {
      let gamePlayers = await sequelize.models.GamePlayers.findAll({
        where: { GameGameId: roomId },
      })
      if (!Array.isArray(gamePlayers)) {
        gamePlayers = [gamePlayers]
      }
      return gamePlayers
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des joueurs de jeu pour la salle ${roomId} :`,
        error,
      )
      throw error
    }
  }
}

module.exports = GamePlayers
