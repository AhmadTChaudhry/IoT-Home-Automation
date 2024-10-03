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

exports.getWelcome = (req, res) => {
    res.render('welcome', {
    });
}

exports.getLogin = (req, res) => {
    res.render('login', {
    });
}

exports.getRegister = (req, res) => {
    res.render('register', {
    });
}
