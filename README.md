# way2atomationtest

# Selenium WebDriver User Table Test

This project contains a Selenium WebDriver script written in JavaScript using the Node.js runtime. The script automates the process of adding users to a web-based user table and logs the test results to a file.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- Chrome browser installed on your machine

## Installation

To set up this project, follow these steps:

1. Clone this repository to your local machine.

    ```bash
    git clone https://github.com/NdivhuwoMutavhatsindi/way2atomationtest.git
    cd way2atomationtest
    ```

2. Install the necessary Node.js packages.

    ```bash
    npm install
    --- this installs all the dependencies in the project
    ```

## Usage

To run the script, follow these steps:

1. Open a terminal or command prompt in the project directory.

2. Run the script using Node.js.

    ```bash
    node ./tests/testcase.js
    ```

## Script Details

The script performs the following steps:

1. Initializes a new Chrome WebDriver instance.
2. Maximizes the browser window.
3. Navigates to the web page containing the user table: [Way2Automation User Table](https://www.way2automation.com/angularjs-protractor/webtables/).
4. Scrolls the user table into view to ensure it's visible.
5. Iterates through a list of predefined users and attempts to add each user to the table.
6. Checks if the username already exists in the table to prevent duplicates.
7. Enters user data into the form fields and submits the form.
8. Logs the test results to a file in a `results` directory, with the file name based on the current date.

## Logging Test Results

The `logTestResult` function logs the test results to a file in the `results` directory. Each log entry includes the time and a message indicating whether the test passed or failed.

### Example Log Entry

