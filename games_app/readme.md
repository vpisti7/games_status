Dokumentáció:

Egy olyan API-t készítettem amivel tárolni tudok játékokat név szerint és mellettük tárolni az adott,
játékban elért haladást és hogy szeretné-e az adott illető folytatni az adott játékot.

Mielőtt használjuk az API-t létre kell hozni egy .env fájlt amibe egy TOKEN_SECRET-nek kelle lennie.
PL: TOKEN_SECRET=ad4e759c1764fc6714f4a7ecbad47762c0e309ab274c6cefc092a0b7df7ada7328ac59101bf809c7e50470bdf3261f2dae26d1d94e728651a0e1c2e72a064a9b

Felhasználó kezelés:

POST http://localhost:8000/user/register
body{
"email": "emailcmi";,
"password": "password"
}

POST http://localhost:8000/user/login
body{
"email": "email cím";,
"password": "jelszó"
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
"game_percent": Teljesített %,(szám)
"wantContinue":"Szeretnéd-e folytatni"(true/false)
}

PUT http://localhost:8000/games/game
{
"game_percent": Teljesített %,(szám)
"wantContinue":"true vagy false érték"
}

DELETE http://localhost:8000/games/game
Játék törlése név alapján

DELETE http://localhost:8000/user
Felhasználó törlése -> elmenette adata törlésre kerül.
{
"email": "email cím";,
"password": "jelszó"
}
