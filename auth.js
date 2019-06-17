require('dotenv').config()
const auth = require('basic-auth');

let username1 = process.env.USERNAME,
  password1 = process.env.PASSWORD

var admins = {}
admins[username1] = { password: password1 }



module.exports = function (request, response, next) {
  var user = auth(request);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"');
    return response.status(401).send();
  }
  return next();
};