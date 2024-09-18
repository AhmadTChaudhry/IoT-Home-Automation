exports.getHomePage = (req, res) => {    
    res.render('home', {
    });
};

exports.getUsage = (req, res) => {    
    res.render('usage', {
    });
}

exports.getDevices = (req, res) => {
    res.render('devices', {
    });
}
