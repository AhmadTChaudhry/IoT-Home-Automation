const chai = require("chai");
const expect = chai.expect;
const dashboardController = require("./controllers/dashboardController"); // Adjust the path based on your file structure

describe("Dashboard Controller", function () {
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

    it("should render the home page", function () {
        dashboardController.getHomePage(req, res); // Call the controller's home page method
        expect(res.renderCalledWith).to.equal("home"); // Check if the correct view ('home') was rendered
    });

    it("should render the usage page", function () {
        dashboardController.getUsage(req, res); // Call the controller's usage page method
        expect(res.renderCalledWith).to.equal("usage"); // Check if the correct view ('usage') was rendered
    });

    it("should render the devices page", function () {
        dashboardController.getDevices(req, res); // Call the controller's devices page method
        expect(res.renderCalledWith).to.equal("devices"); // Check if the correct view ('devices') was rendered
    });

    it("should render the usage page and include charts", function () {
        // Call the controller's usage page method
        dashboardController.getUsage(req, res);

        // Ensure the 'usage' view is rendered
        expect(res.renderedView).to.equal("usage");

        // Check if the rendered view includes chart-related elements
        const htmlContent = `
        <canvas id="myChart"></canvas>
        <canvas id="electricityChart"></canvas>
        <canvas id="gasChart"></canvas>
    `;

        // Check for chart canvas elements (you can adapt this based on the actual HTML content)
        expect(htmlContent).to.include('<canvas id="myChart"></canvas>');
        expect(htmlContent).to.include('<canvas id="electricityChart"></canvas>');
        expect(htmlContent).to.include('<canvas id="gasChart"></canvas>');
    });
});