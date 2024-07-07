const { Builder, Browser, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

// an array of provided users to be added to the user table...
const users = [
    {
        firstName: "FName1",
        lastName: "LName1",
        userName: "User1",
        password: "Pass1",
        customer: "Company AAA",
        role: "Admin",
        email: "admin@mail.com",
        cell: "082555"
    },
    {
        firstName: "FName2",
        lastName: "Lname2",
        userName: "User2",
        password: "Pass2",
        customer: "CompanyBBB",
        role: "Customer",
        email:  "customer@mail.com",
        cell: "083444"
    }
];

(async function example() {

    // initializing a new build...
    let driver = await new Builder().forBrowser(Browser.CHROME).build();

    try {
        await driver.manage().window().maximize();

        // navigating to the web page...
        await driver.get('https://www.way2automation.com/angularjs-protractor/webtables/');

        // validate that we are on the User List Table...
        await driver.executeScript(`document.querySelector('table').scrollIntoView()`);

        // locating the user table...
        let userTable = await driver.findElement(By.css('.smart-table.table.table-striped'));

        // creating a function to adds user data to the form input fields...
        const addUserData = async (userData, row) => {
            let input = await row.findElement(By.css('input'));
            await input.clear();
            await input.sendKeys(userData);
        };

        // iterating through each user to add them to the User List Table...
        for (const user of users) {
            let usernameExists = false;

            // clicking the "Add User" button...
            await userTable.findElement(By.css('.btn.btn-link.pull-right')).click()

            // locating the rows of the table...
            let rows = await userTable.findElements(By.css('tbody .smart-table-data-row.ng-scope'));

            // iterating through all rows in the table...
            for (const row of rows) {
                let cells = await row.findElements(By.css('.smart-table-data-cell'));
                let cellValue = await cells[2].getText();

                // checking if the user exists in the User List Table...
                if (cellValue.toLowerCase() === user.userName.toLowerCase()) {
                    usernameExists = true;
                    console.log(`TEST FAILED - Username (${user?.userName}) already exists :(`);
                    logTestResult(`TEST FAILED - Username (${user?.userName}) already exists :(`);
                    break;
                };
            };

            if (!usernameExists) {
                // locating the modal for adding users...
                let addUserModal = await driver.findElement(By.css('.modal.ng-scope'));
                let modalBody = await addUserModal.findElement(By.css('.modal-body'));
                let modalForm = await modalBody.findElement(By.css('form'));
                let modalRows = await modalForm.findElements(By.css('.smart-table-edit-data-cell.ng-scope'));

                // entering data in the form fields...
                for (const [index, row] of modalRows.entries()) {
                    switch (index) {
                        case 0:
                            // first name...
                            await addUserData(user.firstName, row);
                            break;
                        case 1:
                            // last name...
                            await addUserData(user.lastName, row);
                            break;
                        case 2:
                            // username...
                            await addUserData(user.userName, row);
                            break;
                        case 3:
                            // password...
                            await addUserData(user.password, row);
                            break;
                        case 4:
                            // selecting the type of company between Company AAA and Company BBB...
                            let labels = await row.findElements(By.css('label'));
                            if (user.customer.toLowerCase() === 'company aaa') {
                                await labels[0].findElement(By.css('input')).click();
                            } else {
                                await labels[1].findElement(By.css('input')).click();
                            }
                            break;
                        case 5:
                            // selecting the type of user between Sales Team, Customer and Admin...
                            let selectTag = await row.findElement(By.css('select'));
                            await selectTag.click();
                            let options = await selectTag.findElements(By.css('option'));
                            switch (user.role.toLowerCase()) {
                                case 'sales team':
                                    await options[1].click();
                                    break;
                                case 'customer':
                                    await options[2].click();
                                    break;
                                default:
                                    await options[3].click();
                                    break;
                            }
                            break;
                        case 6:
                            // email...
                            await addUserData(user.email, row);
                            break;
                        case 7:
                            // cell phone number...
                            await addUserData(user.cell, row);
                            break;
                    };
                };

                // submiting user details...
                let modalFooter = await addUserModal.findElement(By.css('.modal-footer'));
                let submitButton = await modalFooter.findElement(By.css('.btn.btn-success'));

                // waiting and checking the submit button is enabled...
                await driver.wait(until.elementIsEnabled(submitButton), 10000);
                await submitButton.click();

                // Wwaiting for 1 second before adding the next user...
                await driver.sleep(1000);
            };

            // getting the updated User List Table rows...
            let newRows = await userTable.findElements(By.css('tbody .smart-table-data-row.ng-scope'));

            let checkUserAdded = false;

            // iterating through all updated User List Table rows
            for (const row of newRows) {
                let cells = await row.findElements(By.css('.smart-table-data-cell'));
                let cellValue = await cells[2].getText();

                // checking if the user was successfully added to the User List Table...
                if (cellValue.toLowerCase() === user.userName.toLowerCase()) {
                    checkUserAdded = true
                    break;
                };
            };

            // loging and adding to the test results the results based on whether the test passed or failed...
            if (checkUserAdded) {
                console.log(`User - (${user?.firstName + ' ' + user?.lastName}) was successfully added to the User List Table.`);
                logTestResult(`User - (${user?.firstName + ' ' + user?.lastName}) was successfully added to the User List Table.`);
            } else {
                console.log(`User - (${user?.firstName + ' ' + user?.lastName}) was not added to the User List Table.`);
                logTestResult(`User - (${user?.firstName + ' ' + user?.lastName}) was not added to the User List Table.`);
            };
        };

        // waiting 5 seconds before going to the next step, so we can see that the users were successfully added to the table...
        await driver.sleep(5000);
    } catch (error) {
        // logging that an error occured...
        console.warn('An Error Occurred:', error);
        logTestResult('TEST FAILED :(');
    } finally {
        // closing or terminating the driver instance or build...
        await driver.quit();
    };
})();

// creating a function to log test results to a file...
const logTestResult = (message) => {
    // creating a that to the results folder, going up one diretory level so that 'results' can be in the main folder...
    const folderPath = path.join(__dirname, '../' , 'results');
    
    // getting current date when each test was ran...
    const date = new Date();

    // creating a filename based on the current date in the format YYYY-MM-DD.txt...
    const fileName = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.txt`;
    
    const filePath = path.join(folderPath, fileName);

    // getting the current time in HH:MM:SS format...
    const time = date.toTimeString().split(' ')[0];

    // checking if the results folder exists, and create it if it does not exist...
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    };

    // Append the log message to the file, creating the file if it doesn't exist...
    const logMessage = `${time} - ${message}\n`;
    fs.appendFileSync(filePath, logMessage, 'utf8');
};
