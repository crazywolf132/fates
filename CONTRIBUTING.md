# Contributing to Fates

First off, thank you for considering contributing to Fates! It's people like you that make Fates such a great tool. We welcome contributions from everyone, whether it's a bug report, feature suggestion, documentation improvement, or code contribution.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Issues](#issues)
  - [Pull Requests](#pull-requests)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Commit Messages](#commit-messages)
- [Versioning](#versioning)

## Code of Conduct

This project and everyone participating in it is governed by the [Fates Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [project_email@example.com](mailto:project_email@example.com).

## Getting Started

### Issues

- Feel free to open an issue for any reason as long as you make it clear if the issue is about a bug/feature/question/comment.
- Please spend a small amount of time giving due diligence to the issue tracker. Your issue might be a duplicate. If it is, please add your comment to the existing issue.
- Remember that users might be searching for your issue in the future, so please give it a meaningful title to help others.
- The issue should clearly explain the reason for opening, the proposal if you have any, and any relevant technical information.

### Pull Requests

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!


## Setting Up Your Development Environment

1. Fork the Fates repository on GitHub.
2. Clone your fork locally:
   ```
   git clone https://github.com/your-username/fates.git
   cd fates
   ```
3. Ensure you have `pnpm` installed. If not, you can install it globally:
   ```
   npm install -g pnpm
   ```
4. Install dependencies:
   ```
   pnpm install
   ```
5. Create a branch for your feature or bug fix:
   ```
   git checkout -b my-feature-branch
   ```

Now you're ready to make your changes!

## Package Management

We use `pnpm` as our package manager for this project. `pnpm` is fast, disk space efficient, and creates a non-flat `node_modules` structure which can help catch dependency issues early.

### Why pnpm?

- **Speed**: pnpm is significantly faster than npm and yarn, especially on clean installs.
- **Efficiency**: pnpm uses a content-addressable store for all installed packages, saving disk space and improving installation times.
- **Strict**: pnpm creates a non-flat `node_modules` structure, which prevents packages from accessing modules they don't declare as dependencies.

### Using pnpm

Here are some common commands you'll use with pnpm:

- Install all dependencies: `pnpm install`
- Add a new dependency: `pnpm add <package-name>`
- Add a dev dependency: `pnpm add -D <package-name>`
- Remove a dependency: `pnpm remove <package-name>`
- Run a script from package.json: `pnpm run <script-name>`

### Lockfile

We commit the `pnpm-lock.yaml` file to the repository. This file ensures that all developers are working with the same dependency versions. Please do not modify this file manually, and do not gitignore it.

## Coding Standards

- We use TypeScript for type safety. Please ensure all your code is properly typed.
- We follow the [TSLint](https://palantir.github.io/tslint/) style guide. Run `npm run lint` to check your code.
- Write clear, readable code and concise comments.
- Use meaningful variable and function names.
- Keep functions small and modular.

## Testing

- We use [Jest](https://jestjs.io/) for testing.
- Write unit tests for new code you create.
- Run the test suite with `npm test` before submitting your pull request.
- Aim for 100% test coverage on new code.

## Documentation

- Keep README.md and API.md up to date as you make changes.
- Comment your code where necessary.
- If you're adding a new feature, please include basic usage examples.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear and standardized commit messages. This helps us maintain a readable git history and automate versioning and changelog generation.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Type

Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
* **chore**: Other changes that don't modify src or test files

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages).

### Subject

The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense. The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Examples

```
feat(parser): add ability to parse arrays

BREAKING CHANGE: The parse method now returns an array instead of an object.

Closes #123
```

```
fix(middleware): ensure headers are correctly set

This commit fixes a bug where headers were not being correctly set in the middleware.

Closes #456
```

```
docs(readme): update installation instructions

Update the README with more detailed installation instructions, including how to install via yarn and pnpm.
```

By following these conventions, we ensure that our commit history is readable and that we can automate versioning and changelog generation.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/crazywolf132/fates/tags).

Thank you for your contributions!