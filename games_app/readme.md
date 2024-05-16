Dokumentáció:

Egy olyan API-t készítettem amivel tárolni tudok játékokat név szerint és mellettük tárolni az adott,
játékban elért haladást és hogy szeretné-e az adott illető folytatni az adott játékot.

Felhasználó kezelés:

POST http://localhost:8000/user/register
body{
"email": "emailcmi";,
"password": "password"
}

POST http://localhost:8000/user/login
body{
"email": "emailcmi";,
"password": "password"
}
Egy JWT tokent ad vissza

Bejelentkezés után adatok:
Az összes végponthoz szükséges a games-ből Auth-ba szükséges bearer token amit a bejelentkezés adott,

GET http://localhost:8000/games
Adott felhasználóhoz tartozó összes játékot lekérdezi
Szűrés:
Query param-ban:
finished: 1 | 0 (true =1,false =0)
wantContinue: 1 | 0

GET http://localhost:8000/games/:game
cím alapján ad vissza egy játékot

POST http://localhost:8000/games
A finished és user_id érétke automatikusan állítódik
{
"game_name":"játék neve"
"completed_percent":"teljesített %",
"wantContinue":"Szeretnéd-e folytatni"
}

PUT http://localhost:8000/games/game
{
"game_percent":"Teljesített százalék",
"wantContinue":"true vagy false érték"
}

DELETE http://localhost:8000/games/game
Játék törlése név alapján
