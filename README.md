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

* Start the database using `yarn db`
  * This can be closed down later using `ps aux | grep mongod` followed by `kill <pid>` where `pid` is the process id of the mongo instance you'd like to stop
  * DO NOT use the `-9` flag on the `kill` command. See [mongodb docs](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/) for reasons, and for other clean kill strategies
* `yarn start` will serve the project, allowing API's to be accessed via `localhost:4200`
* Individual lambdas may be invoked using `serverless invoke -f <function name>` where `<function name>` is the name of the function described by the `serverless.yml` - [docs here](https://serverless.com/framework/docs/providers/google/cli-reference/invoke-local/)

## To do
- Best Practices
  - Ensure that game id and team abbreviations are indexed
- Ingestion
  - Add tests?
  - Make the single ingestion run multiple seasons
- Bye weeks
  - Take season into consideration on bye weeks endpoint
  - Write e2e tests
- Avs scores
  - Make endpoint
  - Write tests

## Strats
- 2
  - Aggregate over straight game data
  - Find games where the homeTeamAbbr or visitorTeamAbbr are equal to the the team query parameter
  - Also match that to the week after the team's bye week
  - Average that across seasons?