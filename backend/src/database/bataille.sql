DROP TABLE Players;
DROP TABLE Games;
DROP TABLE GamePlayers;
DROP TABLE Rooms;

DELETE FROM Rooms WHERE room_id in(1,2,3);
DELETE FROM Players WHERE player_id in(5);
DELETE FROM Game WHERE game_id in(1,2,3);
DELETE FROM Game_Players WHERE id in(1,2,3);

SELECT * from Players;
SELECT * from Game;
SELECT * from Game_Players;
SELECT * from Rooms;