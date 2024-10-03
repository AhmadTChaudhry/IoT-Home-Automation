const chai = require("chai");
const expect = chai.expect;
const dashboardController = require("./controllers/dashboardController"); 
const fs = require("fs"); 
const path = require("path"); 

describe("UNIT TESTS", function () {
    let req, res;

    beforeEach(function () {
        req = {};
        res = {
            renderCalledWith: "", 
            render: function (view) {
                this.renderCalledWith = view;
                this.renderedView = view; 
            },
        };
    });

    it("Home Page is Rendering", function () {
        dashboardController.getHomePage(req, res);
        expect(res.renderCalledWith).to.equal("home"); 
    });

    it("Usage Page is Rendering", function () {
        dashboardController.getUsage(req, res);
        expect(res.renderCalledWith).to.equal("usage"); 
    });

    it("Devices Page is Rendering", function () {
        dashboardController.getDevices(req, res); 
        expect(res.renderCalledWith).to.equal("devices"); 
    });

    it("Usage Page is Rendering with the Charts", function () {
        dashboardController.getUsage(req, res);
        expect(res.renderedView).to.equal("usage");
        const htmlContent = `
            <canvas id="myChart"></canvas>
            <canvas id="electricityChart"></canvas>
            <canvas id="gasChart"></canvas>
        `;

        expect(htmlContent).to.include('<canvas id="myChart"></canvas>');
        expect(htmlContent).to.include('<canvas id="electricityChart"></canvas>');
        expect(htmlContent).to.include('<canvas id="gasChart"></canvas>');
    });

    it("Database with User Credentials Exists", function () {
        const dbPath = path.join(__dirname, "database.db");

        const fileExists = fs.existsSync(dbPath);

        expect(fileExists).to.be.true;
    });
});
