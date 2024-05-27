# RankedAPI 

All calls can be made to https://rankedapi-late-cherry-618.fly.dev/

## All available **GameAPI** calls (https://rankedapi-late-cherry-618.fly.dev/GameAPI): 
| Method | URL | Purpose | Return Codes |
| --- | -- | --- | --- |
| `POST`| `/` | Add a game to the API. | 200, 404 |
| `GET` | `/all`| Obtain all games. | 200, 400, 404 |
| `GET` | `/find/ID` | Obtains the information for the game with id ID. | 200, 404 |
| `GET` | `/active` | Obtains the IDs and active status of games currently in progress. | 200, 404 |
| `PUT` | `/ID` | Updates the game with id ID with the given body. | 200, 400, 404 |

Note that all API calls will return the game information as a JSON object on success and an error message on failure. Only use the GET calls unless you know what you are doing.

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
The above request will create a new game with `Team 1` and `Team 2` names as `Geo` and `Dendro` respectively.

### `GET` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/`

Obtains the game information of every game played.

### `GET` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/ID`

Obtains the game information of the game with the specified ID.

### `PUT` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/ID`

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

### `PUT` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/ID`

## All available **CharacterAPI** calls (https://rankedapi-late-cherry-618.fly.dev/CharAPI): 
| Method | URL | Purpose | Return Codes |
| --- | -- | --- | --- |
| `POST`| `/` | Add a character to the API. | 200, 400, 500|
| `GET` | `/`| Obtain all characters. | 200, 500|
| `GET` | `/ID` | Obtains the information for the character with id ID. | 200, 400, 404, 500 |
| `PUT` | `/ID` | Updates the character with id ID with the given body. | 200, 400, 404, 500 |
| `DELETE` | `/ID` | Removes the character with the given ID from the APi. | 200, 400, 404, 500 |

### `POST` `https://rankedapi-late-cherry-618.fly.dev/CharAPi/add`

Adds a character to the API. To add a character, send a request with a body following this format:
```json
{
    "_id": ID,
    "name": "Character name",
    "element": "element",
    "image": "image link"
}
```
`_id` and `name` are **required**. `image` must be a permanant link to the character infographic and `element` **must** be one of the following (fully lowercase): 
```
pyro, cryo, dendro, electro, hydro, geo, anemo, variable
``` 
Variable should ***only*** be for the Traveler, no one else. The 81 character IDs are from 0 to 80, with characters sorted by release version then alphabetically (Amber is 0, Arlecchino is 80). Entering an invalid ID will return a server error. 

### `GET` `https://rankedapi-late-cherry-618.fly.dev/CharAPi/`

Gets a list of all characters and their corresponding elements and image links. 

### `GET` `https://rankedapi-late-cherry-618.fly.dev/CharAPi/ID`

Gets a specific character with the given ID's information. 

### `PUT` `https://rankedapi-late-cherry-618.fly.dev/CharAPi/ID`

Updates the character with the given ID's information. Requires a body with any amount of the following information: 
```json
{
    "name": "Character name",
    "element": "element",
    "image": "image link"
}
```
Note that the `_id` field is **immutable**. It can not be changed under any circumstances. Same restrictions as adding characters apply.

### `DELETE` `https://rankedapi-late-cherry-618.fly.dev/CharAPi/ID`

Removes the character with the given `_id` from the API. If no such character exists, throws a server error.

For some example API calls, download [Postman](https://www.postman.com/downloads/) and import the [collection](https://github.com/dykim2/RankedAPI/blob/main/RankedAPI%20collection.json) of API calls.