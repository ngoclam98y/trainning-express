const userCtrl = require("../controllers/UserController");

const ctrl = new userCtrl();

module.exports = function (app) {
  app.get("/users", ctrl.doListUsers);
  app.post("/users/create", ctrl.doCreateUser);
  app.get("/users/:id", ctrl.doListUsersById);
};
