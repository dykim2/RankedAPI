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
| `DELETE` | `/ID` | Deletes a specific game. | 200, 404 |

`POST` `https://rankedapi-late-cherry-618.fly.dev/GameAPI/ID`

ID is the internal ID of the game you want to update.