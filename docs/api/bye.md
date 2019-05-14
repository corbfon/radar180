# Bye week endpoint

## Request

path: `/seasons/byes`

| Query     | Required? |
|-----------|-----------|
| season    |     Y     |
| team      |     N     |

Example Request: `/seasons/byes?season=2018&team=MIN`

Example Response:

```javascript
{
  data: [
    {
      "season": 2018,
      "team": {
        "teamId" : "3000",
        "abbr" : "MIN",
        "cityState" : "Minnesota",
        "fullName" : "Minnesota Vikings",
        "nick" : "Vikings",
        "teamType" : "TEAM",
        "conferenceAbbr" : "NFC",
        "divisionAbbr" : "NCN"
      },
      "week": 10
    }
  ]
}
```