# Sports Data Code Challenge

## Problem

Use this NFL schedule feed as your source: https://api.ngs.nfl.com/league/schedule?season=2018&seasonType=REG

Ingest data from the feed into a database of your choice (allow for ingestion of different seasons and season types)

Create TWO endpoints:
* An endpoint that accepts parameters for year/season and/or team alias then returns corresponding teams and bye weeks. A bye week for the NFL is a week that team does NOT play.
* An endpoint should take a team alias as a parameter and return the average number of points AFTER the bye week (optionally by period, so include a period parameter as well).
  * Per Justin 5/10: We were hoping for just average number of points for a single season. We can discuss more and complexities associated to that, but not really in scope

Treat this project as if you were submitting a pull-request for approval to go to production (e.g. project organizations, code quality, etc). It’d be great to see some tests too.

You can send back a zip file, or post a github repo with code, up to you.

Make sure we can run the project once received.

## Solution

After running the project locally, you may test the solutions to the problem by querying the http://localhost:4200/teams endpoint

### Endpoints

* Solution 1:
  * [All teams for a season, with bye weeks](http://localhost:4200/teams?season=2016&returnFields=byeWeek,teamId,abbr,fullName,nick)
  * [Single team for a season, with bye week](http://localhost:4200/teams?season=2017&team=DAL&returnFields=byeWeek,teamId,abbr,fullName,nick)
* Solution 2:
  * [Average points for a team](http://localhost:4200/teams?season=2016&team=DAL&returnFields=teamId,abbr,fullName,nick,seasonScoresAvg.pointTotal)
  * [Average points, by period, for a single team](http://localhost:4200/teams?season=2016&team=DAL&returnFields=teamId,abbr,fullName,nick,seasonScoresAvg)

### Explanation

There are three query parameters which can be used with the `/teams` endpoint: `season`, `team`, `returnFields`. `season` is required. `team` can be used to query the teams by their abbreviations, and `returnFields` can be used in order to mask fields to return. `returnFields` is a comma separated list. If `returnFields` is specified, the endpoint adds information based on whether or not the field was requested. e.g. if `returnFields=teamId,abbr`, then `byeWeek` is not calculated and added.

### Two vs One Endpoint

After completing the exercise, it occurs to me that this is probably considered one endpoint, instead of the "TWO endpoints," as stated in the problem statement. The reason I provided a single endpoint is that the success criteria of the second endpoint directly relies on the data that could be provided by the first, namely, it requires `byeWeek` to be added for a single team. Since the base document was still to be a team, and the data was reliant, it made sense to me to provide a single endpoint.

If I were to change the endpoint to better fulfill the "TWO endpoints" success criteria, I would allow the user to "rebase" the root document by adding another route parameter. E.g. `/teams/{:id}/seasonScoresAvg` would utilize the same logic, but rebase the returned document to the `team.seasonScoresAvg`

### Additional Examples

[All teams in a season, full response](http://localhost:4200/teams?season=2018)
[One team in a season](http://localhost:4200/teams?season=2018&team=DAL)
[One team, including bye week](http://localhost:4200/teams?season=2018&team=DAL&returnFields=byeWeek,teamId,abbr,games,cityState,fullName,nick) - this one excludes some fields
[All teams in a season with average points after bye week](http://localhost:4200/teams?season=2018&returnFields=byeWeek,teamId,abbr,fullName,nick,seasonScoresAvg&seasonScoresStart=byeWeek)
[A single team in a season with average points per quarter, plus OT, after bye week](http://localhost:4200/teams?season=2018&returnFields=byeWeek,teamId,abbr,fullName,nick,seasonScoresAvg.pointQ1,seasonScoresAvg.pointQ2,seasonScoresAvg.pointQ3,seasonScoresAvg.pointQ4,seasonScoresAvg.pointOT&seasonScoresStart=byeWeek)

## Background

* Each team in the NFL has one bye week per season
* Each regular season should contain 17 weeks of play
* Bye weeks likely won't exist in PRE or POST seasons, right?

## First time setup

### Install Homebrew

If you do not have Homebrew installed, do that first:

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

### Install Node dependencies

In order to run the correct version of node and manage packages, you must install NVM, Yarn and, of course, NodeJS itself. You can easily install them via [instructions found here](https://gist.github.com/nijicha/e5615548181676873118df79953cb709).

### Install MongoDB

`brew install mongodb`

### Install javascript packages

While in the directory, run `yarn install` to download all packages

### Ingest data

Do the steps to get the project running locally, and then run `yarn ingest` in order to fill the database with game data

## Running the project locally

* `yarn start` will start the database and serve the project, allowing API's to be accessed via `localhost:4200`
  * To stop the database, run `yarn db:kill`
  * `yarn db` will run the database by itself
* You may start over from the beginning by emptying the database with `yarn db:empty`

## Testing

Run `yarn start` and then `yarn test` in order to run both unit and integration tests. Unit and integration may be run separately by `yarn test:u` and `yarn test:i`, respectively.


## Ideas for improvements

* Make seasonScores return independent of seasonScoresAvg
* Add scheduled ping to keep services alive (reduce first response time)
* Allow querying across multiple seasons
* Refactor `src/model/db.ts` to cache db connection
* Report on data integrity (e.g. 2013 season does not have score data, so average scores cannot be provided)
* Only populate games when necessary (improve conditional querying)
* Add swagger docs
* Make sure games cannot duplicate on ingestion
