# Automated Testing Project with Playwright

This project contains automated tests to verify oredring process of Rozetka marketplace using [Playwright](https://playwright.dev/).

## Requirements

Before starting, ensure that the following tools are installed on your computer:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Project structure

The project is organized as follows:

e2e/ - Contains the automated tests.
playwright.config.js - Playwright configuration file.
test_data/ - Stores CSV files and other test data.

## Running Tests

To run the tests, use the following command:
- npx playwright test

## Generating a Report

To run tests with an HTML report generation, use the following command:
- npx playwright test --reporter=html

To view the generated report after the tests are completed, run:
- npx playwright show-report


## Installation

To install all the necessary dependencies, run the following commands:

```bash
# Clone the repository
git clone <https://github.com/ElKonstantin/k_horovyi_structshare_test>

# Navigate to the project directory
cd <k_horovyi_structshare_test>

# Install dependencies
npm install

