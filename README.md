# CS2103 PR Bot [![Build Status](https://travis-ci.org/nus-cs2103/cs2103-pr-bot.svg?branch=master)](https://travis-ci.org/nus-cs2103/cs2103-pr-bot)
This repository holds the source code to the pull request pre-processing bot that processes student submission to Github in the National University of Singapore, School of Computing [CS2103: Software Engineering](http://www.comp.nus.edu.sg/~cs2103/) class.

There are two goals the bot is achieving for the CS2103 Teaching Team:

  1. Ensures that students provide sufficient information on their pull requests so that the bot can identify the students' tutors and assign the tutors to the correct pull request for reviewing purpose.
  2. Ensures that students submit their pull requests to the correct repository, given that there is a distinction between repositories on `se-edu` vs the repositories forked for the semester.

The bot uses [Accuser](https://github.com/mauris/accuser), a library that enables this bot to process PRs and issues on repositories we selected.

The Github access token is to be stored in an environment variable called `GITHUB_TOKEN`. Tokens can be created and managed for [nus-cs2103-bot](https://github.com/nus-cs2103-bot) by signing to the account and visiting `Settings > Developer Settings > Personal Access Tokens`. Do not commit the token into the repository for security reasons. You may create a file `.env` in the root folder of this repository to set the environment variables for this bot.

Write permissions is required by the bot for tutor assignment, label application and pull request closure.

The current semester's Github account / organization name can be set in the `config.json`, along with the highest level of `addressbook` (1-4) repository available to the students in the `currentLevel` setting in the same file.

The students' tutor and reviewer class mapping can be set in the `data-*.csv` file. (Different data files for different phases).

# Design
## Architecture

There are two main way of getting information about the repositories that the bot is watching: webhooks or interval polling.

Webhooks require the bot to expose a HTTP URL endpoint which Github can perform a HTTP request to whenever there are new changes to the repository. Specifically for Github, new PRs can be received as notifications through this endpoint. This can be thought of as a push model. However, having an unsecured HTTP resource available to the internet may subject the bot to spam or denial of service attacks. The need to secure the HTTP resource may also pose additional requirements which may be out of scope for the bot. Furthermore redelivery of failed delivery of events is not supported by Github.

Interval polling on the other hand would require the bot to request information periodically from Github through their API resources. Authentication is handled by giving the bot access to a Github account which has read/write access to all the repositories it process. However, the bot has to determine which pieces of information are new and which were previously processed. This can be seen as a pull model.

In our case, CS2103 PR Bot employs the interval polling method to retrieve pull requests' information from Github on those repositories that the bot is watching. The bot is currently registered on Github with the handle [nus-cs2103-bot](https://github.com/nus-cs2103-bot). All comments sent from the bot will be shown from that account. The authentication details of the account are currently with Prof Damith and a Github authentication token (env variable `GITHUB_TOKEN`) is used for automated access to Github. By default, the bot will poll Github every 5 mins (default setting of underlying library).

## Components
### Validator
Validator provides two points of entries for interacting with Github PRs, `doBlock` and `filterBlock` as well a customised subset of Github CRUD operations for dealing with PR.

`Blacklist`, `Whitelist` and `Greylist` composes of `Validator` to perform specialised operations. `Blacklist` closes all PR in given repositories. `Whitelist` closes PRs when conditions are met while `Greylist` does the same but with more lax conditions. The three classes have been delibrately separated to highlight their customised functionalities i.e. conditions to close, comments and labelling.

# Deployment

## Checking for repository permissions

Since we are assigning permission for the PR Bot for each invidual repository separately, it's good to check that the bot has all the required permissions for every relevant repositories before deployment.
To check that the bot has enough permissions:
    `npm run checkPermissions`

## Requirements

The bot requires the following in the production environment:

- Node.js v6.3.0 or newer installed
- Internet access (in/out on HTTP/HTTPS)

All Node.js dependencies and their version numbers are described in `package.json`.

# Contributing

You may find more information about contributing to `cs2103-pr-bot` in the [`CONTRIBUTING.md`](CONTRIBUTING.md) file.

## Reporting a Bug

To report a bug, create an [issue](https://github.com/nus-cs2103/cs2103-pr-bot/issues). Ensure that you search for existing issues reported first before making yours. If it is a possible bug with the underlying library Accuser, [create an issue there](https://github.com/mauris/accuser/issues).

# License

Code released under the MIT license.
