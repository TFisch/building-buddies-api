exports.validateUserParams = (req, res, next) => {
  const requiredParams = ['name', 'email', 'building_id', 'password'];

  requiredParams.forEach((param) => {
    if (!req.body[param]) {
      return res.status(422).json({
        error: `Expected format: { name: <String>, email: <String>, password: <String>, building_id: <Integer> }. You're missing a "${param}" property.`,
      });
    }
  });
  next();
};
