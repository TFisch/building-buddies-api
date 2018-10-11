exports.validateUserParams = (req, res, next) => {
  const requiredParams = ['name', 'email', 'building_id', 'password'];

  const failedParams = requiredParams.filter(param => !req.body[param]);

  if (failedParams.length) {
    return res.status(422).json({
      error: `Expected format: { name: <String>, email: <String>, password: <String>, building_id: <Integer> }. You're missing a "${failedParams[0]}" property.`,
    });
  }
  next();
};
