const {
    sequelize
} = require("../database/db")

class Room {
    constructor(name, numCards, creator) {
        this.room_name = name
        this.room_creator = creator
        this.room_number_of_cards = numCards
        this.room_players = null
        this.room_lastCard = null
    }

    async createRoomToDatabase() {
        try {
            const roomNameExist = await Room.findNameRoom(this.room_name)
            if (roomNameExist.length === 0) {
                let newRoom = await sequelize.models.Room.create({
                    room_name: this.room_name,
                    room_creator:  this.room_creator,
                    room_number_of_cards: this.room_number_of_cards
                })
                return newRoom;
            }else{
                console.warn("Impossible d'enregistrer cette salle car elle existe déjà.")
                return null
            }
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement de la salle ${this.room_name} dans la base de données :`, error);
            throw error;
        }
    }

    static async findNameRoom(name) {
        const [results, metadata] = await sequelize.query("SELECT * FROM Rooms WHERE room_name=? ", {
            replacements: [name]
        })
        console.log("results", results)
        console.log("metadata", metadata)
        return results
    }

}

module.exports = Room