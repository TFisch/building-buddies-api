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

exports.validateInterestParam = (req, res, next) => {
  if (!req.body.name) {
    return res.status(422).json({
      error:
        'Expected format: { name: <String> }. You\'re missing a name property.',
    });
  }
  next();
};

exports.validateBuildingParams = (req, res, next) => {
  const requiredParams = ['name', 'address'];

  const failedParams = requiredParams.filter(param => !req.body[param]);

  if (failedParams.length) {
    return res.status(422).json({
      error: `Expected format: { name: <String>, address: <String> }. You're missing a "${failedParams[0]}" property.`,
    });
  }
  next();
};
