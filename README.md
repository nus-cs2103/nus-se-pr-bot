# CS2103 PR Bot

This repository holds the source code to the pull request pre-processing bot that processes student submission to Github in the National University of Singapore, School of Computing [CS2103: Software Engineering](http://www.comp.nus.edu.sg/~cs2103/) class.

There are two goals the bot is achieving for the CS2103 Teaching Team:

  1. CS2103 PR Bot ensures that students provide sufficient information on their pull requests so that the bot can identify the students' tutors and assign the tutors to the correct pull request for reviewing purpose.
  2. CS2103 PR Bot also ensures that students submit their pull requests to the correct repository, given that there is a distinction between repositories on `se-edu` vs the repositories forked for the semester. 

The bot uses [Accuser](https://github.com/mauris/accuser), a library that enables this bot to process PRs and issues on repositories we selected.

The Github access token is to be stored in an environment variable called `GITHUB_TOKEN`. You may create a file `.env` in the root folder of this repository to set the environment variables for this bot.

The tutors' mapping to the tutorial classes are found in the `src/mapping.json` file.

## Architecture

There are two main way of getting information about the repositories that the bot is watching: webhooks or interval polling.

Webhooks require the bot to expose a HTTP URL endpoint which Github can perform a HTTP request to whenever there are new changes to the repository. Specifically for Github, new PRs can be received as notifications through this endpoint. This can be thought of as a push model. However, having an unsecured HTTP resource available to the internet may subject the bot to spam or denial of service attacks. The need to secure the HTTP resource may also pose additional requirements which may be out of scope for the bot.

Interval polling on the other hand would require the bot to request information periodically from Github through their API resources. Authentication is handled by giving the bot access to a Github account which has read/write access to all the repositories it process. However, the bot has to determine which pieces of information are new and which were previously processed. This can be seen as a pull model.

In our case, CS2103 PR Bot employs the interval polling method to retrieve pull requests' information from Github on those repositories that the bot is watching. The bot is currently registered on Github with the handle [nus-cs2103-bot](https://github.com/nus-cs2103-bot). All comments sent from the bot will be shown from that account. The authentication details of the account are currently with Prof Damith and a Github authentication token (env variable `GITHUB_TOKEN`) is used for automated access to Github.

# Contributing

## Reporting a Bug

To report a bug, create an [issue](https://github.com/mauris/cs2103-pr-bot/issues). Ensure that you search for existing issues reported first before making yours. If it is a possible bug with the underlying library Accuser, [create an issue there](https://github.com/mauris/accuser/issues).

## Submitting a PR

Any changes to the functionality of this bot requires the approval of the module coordinator of CS2103. However, you may submit a pull request for minor bug fixes if you are able to solve it. All PRs must be merged into the `develop` branch instead of `master`.

## Deployment

The repository is configured to deploy whenever new changes are made to this repository. Ensure that changes are tested locally before pushing. Changes should go into the `develop` branch first before merging into `master` for deployment.

# License

Code released under the MIT license.
