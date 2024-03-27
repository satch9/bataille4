const {
    sequelize,
} = require("../database/db")

const Player = require("./Player")

class Room {
    constructor(name, numCards, creator) {
        this.room_name = name
        this.room_creator = creator
        this.room_number_of_cards = numCards
        this.room_creator_name = ""
        this.room_players = null
        this.room_lastCard = null
    }

    async createRoomToDatabase() {
        try {
            const roomNameExist = await this.findRoomByName(this.room_name)
            //console.log("roomNameExist", roomNameExist)
            if (roomNameExist.length === 0) {
                let newRoom = await sequelize.models.Room.create({
                    room_name: this.room_name,
                    room_creator: this.room_creator,
                    room_number_of_cards: this.room_number_of_cards
                })

                // Récupérer les détails du joueur créateur
                const creatorDetails = await Player.findPlayerById(this.room_creator);
                if (creatorDetails) {
                    newRoom.room_creator_name = creatorDetails.player_name
                    await newRoom.save()
                } else {
                    console.warn("Impossible de trouver les détails du créateur de la salle.");
                }
                //console.log("newRoom", newRoom)
                return newRoom;
            } else {
                console.warn("Impossible d'enregistrer cette salle car elle existe déjà.")
                return roomNameExist
            }
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement de la salle ${this.room_name} dans la base de données :`, error);
            throw error;
        }
    }

    static async findRoomByName(name) {
        let sql = "SELECT * FROM Rooms WHERE room_name=? "
        const [results, metadata] = await sequelize.query(sql, {
            replacements: [name]
        })
        //console.log("results", results)
        //console.log("metadata", metadata)
        return results
    }

    static async getAllRooms(callback) {
        try {
            const rows = sequelize.models.Room.findAll()
            rows.then(data => callback(null, data)).catch(err => callback(err, []))
        } catch (error) {
            console.error(`Erreur lors de la récupération de toutes les salles :`, error);
            callback(error);
        }
    }

    static async findRoomById(roomId) {
        try {
            let sql = "SELECT * FROM Rooms WHERE room_id=? "
            const [results, metadata] = await sequelize.query(sql, {
                replacements: [roomId]
            })
            return results
        } catch (error) {
            console.error(`Erreur lors de la récupération de la salle avec l'id: ${roomId} :`, error);
        }
    }

}

module.exports = Room