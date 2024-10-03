const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { findUserByEmail, findUserById } = require('../models/userModel');

const initialize = (passport) => {
  const authenticateUser = (email, password, done) => {
    findUserByEmail(email, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'No user with that email' });

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) return done(null, user);
        return done(null, false, { message: 'Password incorrect' });
      });
    });
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    findUserById(id, (err, user) => {
      if (err) return done(err);
      return done(null, user);
    });
  });
};

module.exports = initialize;
