const {
    db,
    sequelize
} = require("../database/db")

class Player {
    constructor(player_socket_id, player_name) {
        this.player_id = null
        this.player_name = player_name
        this.player_score = 0
        this.player_hand = null
        this.player_socket_id = player_socket_id
    }

    async saveCreatorToDatabase() {
        try {
            const playerNameExist = await Player.findNamePlayer(this.player_name)
            //console.log("playerNameExist", playerNameExist)
            if (playerNameExist.length === 0) {
                let newPlayer = await sequelize.models.Player.create({
                    player_name: this.player_name,
                    player_score: this.player_score,
                    player_hand: this.player_hand,
                    player_socket_id: this.player_socket_id
                })
                //console.log("newPlayer", newPlayer)
                return newPlayer.player_id
            } else {
                console.warn("Impossible d'enregistrer ce joueur car il existe déjà.")
                return null
            }
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement du joueur ${this.player_name} dans la base de données :`, error);
            throw error;
        }
    }
    static async findNamePlayer(name) {
        const [results, metadata] = await sequelize.query("SELECT * FROM Players WHERE player_name=? ", {
            replacements: [name]
        })
        //console.log("results", results)
        //console.log("metadata", metadata)
        return results
    }
}

module.exports = Player