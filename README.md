# CS2103 PR Bot

This repository holds the source code to the pull request pre-processing bot that processes student submission to Github in the National University of Singapore, School of Computing CS2103: Software Engineering class.

The bot uses [Accuser](https://github.com/mauris/accuser), a library that enables this bot to process PRs and issues on repositories we selected.

The Github access token is to be stored in an environment variable called `GITHUB_TOKEN`. You may create a file `.env` in the root folder of this repository to set the environment variables for this bot.

The tutors' mapping to the tutorial classes are found in the `src/mapping.json` file.

# Contributing

## Reporting a Bug

To report a bug, create an [issue](https://github.com/mauris/cs2103-pr-bot/issues). Ensure that you search for existing issues reported first before making yours. If it is a possible bug with the underlying library Accuser, [create an issue there](https://github.com/mauris/accuser/issues).

## Submitting a PR

Any changes to the functionality of this bot requires the approval of the module coordinator of CS2103. However, you may submit a pull request for minor bug fixes if you are able to solve it. All PRs must be merged into the `develop` branch instead of `master`.

## Deployment

The repository is configured to deploy whenever new changes are made to this repository. Ensure that changes are tested locally before pushing. Changes should go into the `develop` branch first before merging into `master` for deployment.

# License

Code released under the MIT license.
