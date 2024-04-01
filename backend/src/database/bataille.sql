DROP TABLE Players;
DROP TABLE Games;
DROP TABLE GamePlayers;
DROP TABLE Rooms;

DELETE FROM Rooms WHERE room_id in(1,2,3,4,5,6,7,8);
DELETE FROM Players WHERE player_id in(1,2,3,4,5);
DELETE FROM GameS WHERE game_id in(1,2,3,4,5);
DELETE FROM GamePlayers WHERE gamePlayers_id in(1,2,3,4,5);

SELECT * from Players;
SELECT * from Game;
SELECT * from Game_Players;
SELECT * from Rooms;