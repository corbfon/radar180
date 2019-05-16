# SportRadar Code Challenge

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

## Problem answer

After running the project locally, the "answers" to both of the problem statements are behind a single endpoint, controlled with query parameters. Try these queries:

[All teams in a season](http://localhost:4200/teams?season=2018)
[One team in a season](http://localhost:4200/teams?season=2018&team=DAL)
[One team, including bye week](http://localhost:4200/teams?season=2018&team=DAL&returnFields=byeWeek,teamId,abbr,games,cityState,fullName,nick) - this one excludes some fields
[All teams in a season with average points after bye week](http://localhost:4200/teams?season=2018&returnFields=byeWeek,teamId,abbr,fullName,nick,seasonScoresAvg&seasonScoresStart=byeWeek)
[A single team in a season with average points per quarter, plus OT, after bye week](http://localhost:4200/teams?season=2018&returnFields=byeWeek,teamId,abbr,fullName,nick,seasonScoresAvg.pointQ1,seasonScoresAvg.pointQ2,seasonScoresAvg.pointQ3,seasonScoresAvg.pointQ4,seasonScoresAvg.pointOT&seasonScoresStart=byeWeek)

## Ideas for improvements

* Make seasonScores return independent of seasonScoresAvg
* Allow querying across multiple seasons
* It is possible that mongodb is connecting on every request (increasing response times) - troubleshoot on development deployment and ensure only one connection is made
* Report on data integrity (e.g. 2013 season does not have score data, so average scores cannot be provided)
* Only populate games when necessary (improve conditional querying)
* Bye weeks
  * add api docs in serverless
* Avg scores
  * Add api docs in serverless