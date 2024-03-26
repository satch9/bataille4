const {
    sequelize
} = require("../database/db")

class Game {
    constructor(game_room_id) {
        this.game_id = null
        this.game_room_id = game_room_id
        this.game_current_player = null
        this.game_end_date = null
        this.game_winner_id = null
    }

    async createGameToDatabase() {
        try {
            let newGame = await sequelize.models.Game.create({
                game_room_id: this.game_room_id,
            })
            return newGame;
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement de la partie ${this.game_id} dans la base de données :`, error);
            throw error;
        }
    }

}

module.exports = Game