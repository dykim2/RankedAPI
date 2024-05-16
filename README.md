# RankedAPI

All calls can be made to https://rankedapi-late-cherry-618.fly.dev/

All available GameAPI calls (https://rankedapi-late-cherry-618.fly.dev/GameAPI): 
| Method | URL | Purpose | Return Codes |
| --- | -- | --- | --- |
| `POST`| `/` | Add a game to the API. | 200, 404 |
| `GET` | `/`| Obtain all games. | 200, 400, 404 |
| `GET` | `/ID` | Obtains the information for the game with id ID. | 200, 404 |
| `PUT` | `/ID` | Updates the game with id ID with the given body. | 200, 400, 404 |
| `PUT` | `/times/ID` | Updates the game with id ID to add the specified times. | 200, 400, 404 |

Note that all API calls will return the game information as a JSON object on success and an error message on failure.

ID is the internal ID of the game you want to update.
For all `PUT` and `POST` GameAPI requests, the following options are available to be changed (all strings are fully editable):
```json
{
    "players": [
        "p1",
        "p2",
        "p3"
    ],
    "division": "Test Division",
    "bosses": [
        "Maguu Kenki",
        "Jadeplume Terrorshroom",
        "Aeonblight Drake"
    ],
    "result": "Team 1 wins!",
    "team1": "",
    "team2": "",
    "timest1": [
        0,
        0,
        0
    ],
    "bans": [
        "Ban 1",
        "Ban 2",
        "Ban 3"
    ],
    "pickst1": [
        "Aloy",
        "Kaedehara Kazuha",
        "Sangonomiya Kokomi"
    ],
    "pickst2": [
        "Bennett",
        "Ganyu",
        "Lyney"
    ]
}
```
Note that the ban and pick character names must start with an uppercase letter and all other letters are lowercase.

`POST` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/ID`

Create a new game with the given ID. An example body would look like this:
```json
{
    "team1": "Geo",
    "team2": "Dendro"
}
```
The above request will create a new game with `Team 1` and `Team 2` names as `Geo` and `Dendro` respectively.

`PUT` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/ID`

Updates the game information with the corresponding body information. An example body would look as follows:
```json
{
    "division": "Open",
    "players": [
        "Player 1",
        "Player 2"
    ]
}
```
The above request would change the `division` and `players` of the game with id ID to `Open` and `[Player 1, Player 2]` respective.

`PUT` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/times/ID`

Updates the time of the specified boss with the given time. This request has a very specific syntax, and not following it will result in an error. Specify a boss number in order of boss selection and a time.

```json
{
    "timest1": [4, 13.32]
}
```
updates the 5th boss of team 1's time to be 13.32 seconds.