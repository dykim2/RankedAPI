# RankedAPI 

All calls can be made to https://rankedapi-late-cherry-618.fly.dev/

## All available **GameAPI** calls (https://rankedapi-late-cherry-618.fly.dev/GameAPI): 
| Method | URL | Purpose | Return Codes |
| --- | -- | --- | --- |
| `POST`| `/` | Add a game to the API. | 200, 404 |
| `GET` | `/all`| Obtain all games. | 200, 400, 404 |
| `GET` | `/find/ID` | Obtains the information for the game with id ID. | 200, 404 |
| `GET` | `/active` | Obtains the IDs and active status of games currently in progress. | 200, 404 |
| `GET` | `/latest` | Obtains the ID of the game most recently created . | 200, 404 |
| `PUT` | `/game/ID` | Updates the game with id ID with the given body. | 200, 400, 404 |
| `PUT` | `/players/ID` | Updates the player connected information of game with id ID with the set information. | 200, 400, 404 |
| `DELETE` | `/ID` | Updates the game with id ID with the given body. | 200, 400, 404 |

Note that all API calls will return the game information as a JSON object on success and an error message on failure. Only use the GET calls unless you know what you are doing.

All requests with a body require a `"Content-Type": "application/json"` header

ID is the internal ID of the game you want to update.
For all `PUT` and `POST` GameAPI requests, the following options are available to be changed (all strings are fully editable):
```json
{
    "playerst1": [
        "p1",
        "p2",
        "p3"
    ],
    "playerst2": [
        "p4",
        "p5",
        "p6"
    ],
    "division": "Test Division",
    "bosses": [
        "Maguu Kenki",
        "Jadeplume Terrorshroom",
        "Aeonblight Drake"
    ],
    "result": "Team 1 wins!",
    "connected": [0,0,0,0],
    "team1": "Team 1 Name",
    "team2": "Team 2 Name",
    "timest1": [
        0,
        0,
        0
    ],
    "timest2": [
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
       1,
       8,
       22
    ],
    "pickst2": [
        3,
        5,
        11
    ]
}
```
The IDs of characters start from 0 and are categorized by release version then alphabetically, with 0 being Amber and 83 being Sigewinne.

### `POST` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/ID`

Create a new game with the given ID. An example body would look like this:
```json
{
    "team1": "Geo",
    "team2": "Dendro"
}
```
The above request will create a new game with `Team 1` and `Team 2` names as `Geo` and `Dendro` respectively. If a game with the given id already exists, the APi will create a game with an ID of the newest game + 1.

### `GET` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/all`

Obtains the game information of every game played.

### `GET` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/find/ID`

Obtains the game information of the game with the specified ID.

### `GET` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/active`

Obtains a list of every game that is currently active and not finished. Returns their ids, results, and connected status. 

### `GET` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/latest/ID`

Obtains the id of the most recently created game in the form of a JSON string.

### `PUT` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/game/ID`

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

### `PUT` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/players/ID`

Updates the connected player information for the game with id ID. Request should be in the following format:

```json
{
    "player": "<1/2/ref>"
}
```
`player` can be one of "1", "2", or "ref". If not, the server will throw an error. 

### `DELETE` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/ID`

Deletes the specified game.

## All available **CharacterAPI** calls (https://rankedapi-late-cherry-618.fly.dev/CharAPI): 
| Method | URL | Purpose | Return Codes |
| --- | -- | --- | --- |
| `POST`| `/` | Add a character to the API. | 200, 400, 500|
| `GET` | `/`| Obtain all characters. | 200, 500|
| `GET` | `/ID` | Obtains the information for the character with id ID. | 200, 400, 404, 500 |
| `PUT` | `/ID` | Updates the character with id ID with the given body. | 200, 400, 404, 500 |
| `DELETE` | `/ID` | Removes the character with the given ID from the APi. | 200, 400, 404, 500 |

### `POST` `https://rankedapi-late-cherry-618.fly.dev/CharAPI/add`

Adds a character to the API. To add a character, send a request with a body following this format:
```json
{
    "_id": ID,
    "name": "Character name",
    "element": "element",
    "image": "image link",
    "icon": "icon link"
}
```
`_id` and `name` are **required**. `image` must be a permanant link to the character infographic and `element` **must** be one of the following (fully lowercase): 
```
pyro, cryo, dendro, electro, hydro, geo, anemo, variable
``` 
Variable should ***only*** be for the Traveler, no one else. The 84 character IDs are from 0 to 83, with characters sorted by release version then alphabetically (Amber is 0, Sigewinne is 80). Entering an invalid ID will return a server error. 

### `GET` `https://rankedapi-late-cherry-618.fly.dev/CharAPI/`

Gets a list of all characters and their corresponding elements and image links. 

### `GET` `https://rankedapi-late-cherry-618.fly.dev/CharAPI/ID`

Gets a specific character with the given ID's information. 

### `PUT` `https://rankedapi-late-cherry-618.fly.dev/CharAPI/ID`

Updates the character with the given ID's information. Requires a body with any amount of the following information: 
```json
{
    "name": "Character name",
    "element": "element",
    "image": "image link",
    "icon": "icon link"
}
```
Note that the `_id` field is **immutable**. It can not be changed under any circumstances. Same restrictions as adding characters apply.

### `PUT` `https://rankedapi-late-cherry-618.fly.dev/CharAPI/restrictions/ID`

Updates the character with the given ID's restrictions at a set constellation level (index). Either one constellation restriction or all constellation restrictions can be modified at once.
```json
{
    "restriction": "", // only use if updating one constellation
    "restrictions": [""], // only use if updating all constellations
    "type": "all" // either 'all' or 'single', all for all constellations
}
```

### `DELETE` `https://rankedapi-late-cherry-618.fly.dev/CharAPI/ID`

Removes the character with the given `_id` from the API. If no such character exists, throws a server error.

For some example API calls, download [Postman](https://www.postman.com/downloads/) and import the [collection](https://github.com/dykim2/RankedAPI/blob/main/RankedAPI%20collection.json) of API calls.