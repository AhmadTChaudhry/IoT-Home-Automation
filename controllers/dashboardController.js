const usageModel = require('../models/usageModel');

// Controller for rendering the home dashboard page
exports.getHomePage = (req, res) => {
    // Fetch weekly gas and electricity usage from model
    const weeklyUsage = usageModel.getWeeklyUsage();
    
    res.render('home', {
        weeklyGasUsage: weeklyUsage.gas,
        weeklyElectricityUsage: weeklyUsage.electricity
    });
};

exports.getHomePage2 = (req, res) => {    
    res.render('home2', {
    });
}
