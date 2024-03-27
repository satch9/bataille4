const {
    sequelize
} = require("../database/db")

class GamePlayers {
    constructor(gameId, playerId) {
        this.gamePlayers_GameGameId = gameId
        this.gamePlayers_PlayerPlayerId = playerId
        this.gamePlayers_score = 0
        this.gamePlayers_hand = null
    }

    async createGamePlayersToDatabase() {
        try {
            let newGamePlayers = await sequelize.models.GamePlayers.create({
                GameGameId: this.gamePlayers_GameGameId,
                PlayerPlayerId: this.gamePlayers_PlayerPlayerId
            })
            return newGamePlayers
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement dans la base de données de la table GamePlayers :`, error);
            throw error;
        }
    }

    static async addPlayerToRoom(roomid, playerId){
        try {
            
        } catch (error) {
            
        }
    }
}

module.exports = GamePlayers