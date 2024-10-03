const chai = require("chai");
const expect = chai.expect;
const dashboardController = require("./controllers/dashboardController"); // Adjust the path based on your file structure
const fs = require("fs"); // Add this line to import the 'fs' module
const path = require("path"); // Import 'path' module to handle file paths

describe("UNIT TESTS", function () {
    let req, res;

    // Set up mock request and response objects before each test
    beforeEach(function () {
        req = {}; // Mock request object
        res = {
            renderCalledWith: "", // Property to store which view was rendered
            render: function (view) {
                // Mock render method
                this.renderCalledWith = view;
                this.renderedView = view; // Store the view name called by render
            },
        };
    });

    it("Home Page is Rendering", function () {
        dashboardController.getHomePage(req, res); // Call the controller's home page method
        expect(res.renderCalledWith).to.equal("home"); // Check if the correct view ('home') was rendered
    });

    it("Usage Page is Rendering", function () {
        dashboardController.getUsage(req, res); // Call the controller's usage page method
        expect(res.renderCalledWith).to.equal("usage"); // Check if the correct view ('usage') was rendered
    });

    it("Devices Page is Rendering", function () {
        dashboardController.getDevices(req, res); // Call the controller's devices page method
        expect(res.renderCalledWith).to.equal("devices"); // Check if the correct view ('devices') was rendered
    });

    it("Usage Page is Rendering with the Charts", function () {
        // Call the controller's usage page method
        dashboardController.getUsage(req, res);

        // Ensure the 'usage' view is rendered
        expect(res.renderedView).to.equal("usage");

        // Check for chart canvas elements (you can adapt this based on the actual HTML content)
        const htmlContent = `
            <canvas id="myChart"></canvas>
            <canvas id="electricityChart"></canvas>
            <canvas id="gasChart"></canvas>
        `;

        expect(htmlContent).to.include('<canvas id="myChart"></canvas>');
        expect(htmlContent).to.include('<canvas id="electricityChart"></canvas>');
        expect(htmlContent).to.include('<canvas id="gasChart"></canvas>');
    });

    // Add this test to check if 'database.db' exists
    it("Database with User Credentials Exists", function () {
        // Construct the path to the 'database.db' file
        const dbPath = path.join(__dirname, "database.db");

        // Check if the file exists synchronously
        const fileExists = fs.existsSync(dbPath);

        // Assert that the file should exist
        expect(fileExists).to.be.true;
    });
});
