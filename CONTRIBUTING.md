# Contributing to CS2103's PR Bot

Thank you for your interest in working on CS2103's PR Bot. We welcome your patches and contributions to this project.

## Setting up

1. Fork this repository to your account

2. Clone your fork of this repository
````
    git clone https://github.com/{yourUsername}/cs2103-pr-bot
````

3. Install dependencies
````
    npm install
````

## Code Reviews

All submissions, including submissions by project members, require review. We will use GitHub's pull requests for this purpose. Consult [GitHub Help](https://help.github.com/articles/about-pull-requests/) for more information on using pull requests.

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript

- Prefer ES6 classes over prototypes.
- Use strict equality checks (`===` and `!==`) except when comparing against (null or undefined).
- Prefer arrow functions `=>`, over the function keyword except when defining classes or methods.
- Use semicolons at the end of each statement.
- Prefer single quotes.
- Use `PascalCase` for classes, `lowerCamelCase` for variables and functions, `SCREAMING_SNAKE_CASE` for constants, `_singleLeadingUnderscore` for private variables and functions.
- Prefer promises over callbacks.
- Prefer array functions like `map` and `forEach` over for loops.
- Use `const` for declaring variables that will never be re-assigned, and let otherwise.
- Avoid `var` to declare variables.
- Use a trailing comma after each item in a multi-line array or object literal, including the last item.

To use the code linter, run

    npm run lint

## Testing
PR bot uses `Jest` for testing. Ensure that dev dependency is installed. To run tests during development:

    npm run testDev

All test files should be named `*.test.js` and reside in the `test` directory.
Jest is [configured to watch](http://facebook.github.io/jest/docs/en/cli.html#watchall) for changes.


## Adding dependencies

For all dependencies (both installation and development):

- **Do not add** a dependency if the desired functionality is easily implementable.
- If adding a dependency, it should be well-maintained and trustworthy.

A barrier for introducing new installation dependencies is especially high:

- **Do not add** installation dependency unless it's critical to project success.

## Code of Conduct

Please refer to [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) for our Contributor Covenant Code of Conduct.
