const Request = require('./core/Request');
const Auth = require('./core/Auth');
const Account = require('./core/Account');
const Stock = require('./core/Stock');
const Order = require('./core/Order');
const Instrument = require('./core/Instrument');

module.exports = class RobinhoodNode {
  get Stock() { return Stock };
  get Auth() { return Auth };
  get Account() { return Account };
  get Order() { return Order };
  get Instrument() { return Instrument };

  constructor(params) {
    if (params && params.token) {
      Request.setToken(params.token);
    }
  }

  async getToken(params) {
    let token = null;
    try {
        token = await Auth.getToken(params);
        console.log('token',token.access_token)
        Request.setToken(token.access_token);
        return token.access_token;
    } catch (reason) {
        console.log("Failed to get token");
        this.error = reason.error;
        if (reason.response && reason.response.body) {
            let body = ("object" !== typeof reason.response.body) ?
                JSON.parse(reason.response.body) :
                reason.response.body;
            this.challenge = body.challenge;
            console.log("Got challenge", this.challenge);
        }
        return null;
    }
  }

  async getChallenge(challenge_id, challenge_code) {
    const token = await Auth.getChallenge(challenge_id, challenge_code);
    console.log('token',token);
    Request.setToken(token.access_token);
    return token.access_token;
  }

  generateDeviceToken() {
    return Auth.generateDeviceToken();
  }
}
