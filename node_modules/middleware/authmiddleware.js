const jwt = require("jsonwebtoken");
const { user } = require("../models");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    res.status(400).send({
      erroMessage: "로그인 후 사용하세요!",
    });
    return;
  }
  try {
    console.log(tokenValue)
    const { user_Id } = jwt.verify(tokenValue, "my-secret-key");
    console.log(user_Id)
    user.findByPk(user_Id).then((result) => {
      res.locals.user = user_Id;
      console.log('pleaseeeeeee', user, res.locals.user)
      next();
    });
  } catch (error) {
    res.status(400).send({
      erroMessage: "로그인 후 사용하세요!",
    });
    return;
  }
};
