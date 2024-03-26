DROP TABLE Players;
DROP TABLE Game;
DROP TABLE Game_Players;
DROP TABLE Rooms;

DELETE FROM Rooms WHERE room_id in(1,2,3);
DELETE FROM Players WHERE id in(1,2,3);
DELETE FROM Game WHERE game_id in(1,2,3);
DELETE FROM Game_Players WHERE id in(1,2,3);