const session = function (req, res, next) {
  if (req.cookies.session === undefined) {
    res.cookie('session', '{}');
  }

  req.session = {
    get: key => {
      const session = JSON.parse(req.cookies.session);
      if (typeof key === 'undefined') {
        return session;
      }
      return session[key];
    }
  };

  res.session = {
    set: (key, value) => {
      const session = JSON.parse(req.cookies.session);

      if (typeof value === 'undefined') {
        return session[key];
      }

      session[key] = value;
      const sessionString = JSON.stringify(session);
      req.cookies.session = sessionString;
      res.cookie('session', sessionString);
    },

    reset: () => res.cookie('session', '{}')
  };

  next();
};

module.exports = session;
