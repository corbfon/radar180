# Bye data info

## How to determine bye weeks

* Every team should play 16 games in a 17 week season
* Every team plays one game per week
* Determining bye week could be accomplished by determining which week the team did not play a game
  * Could this be affected by weather?
  * Does the data support this?

## Vikings Bye Investigation

Query for getting all of the weeks that MIN played games, when raw game data is saved

```javascript
var weeks = []
db.getCollection('games').find({
    $or: [
        { 'homeTeam.abbr': 'MIN' },
        { 'visitorTeam.abbr': 'MIN' }
    ],
    seasonType: 'REG'
}).forEach(game => {
    weeks.push(game.week)
})
printjson(weeks.sort((a, b) => a >= b ? 1 : -1))

// result: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17 ]
```

It's apparent from the above query that week 10 was the bye. That could be used to return the bye week directly.