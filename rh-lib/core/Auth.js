const Request  = require('./Request');

module.exports = class Auth {
  constructor(args) {
    return Request.post('oauth2/token', { symbols: this.symbols.map(s => s.toUpperCase()).join(',') } );
  }

  static getToken(params) {
    const auth = {
        username: params.username,
        password: params.password,
        device_token: params.device_token,
        challenge_type: 'sms',
        grant_type: 'password',
        client_id: 'c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS',
        scope: 'internal',
        expires_in: 86400
    };
    if (params.mfa_code) {
        auth.mfa_code = params.mfa_code;
    }
    let headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "X-Robinhood-API-Version": "1.0.0",
        "Connection": "keep-alive",
        "User-Agent": "Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)"
    };
    if (params.challenge_id) {
        headers["X-ROBINHOOD-CHALLENGE-RESPONSE-ID"] = String(params.challenge_id);
    }
    console.log("Auth data", auth);
    return Request.post('oauth2/token', auth, {
        headers: headers
    });
  }

  static getChallenge(challenge_id, challenge_code) {
    const challenge = {
        response: String(challenge_code)
    };
    console.log("Submitting challenge", challenge);
    return Request.post('challenge/' + String(challenge_id) + '/respond', challenge, {
        headers: {
            "X-ROBINHOOD-CHALLENGE-RESPONSE-ID": String(challenge_id)
        }
    });
  }

  static generateDeviceToken() {
    const rands = [];
    for (let i = 0; i < 16; i++) {
      const r = Math.random();
      const rand = 4294967296.0 * r;
      rands.push(
        (rand >> ((3 & i) << 3)) & 255
      );
    }
  
    let id = '';
    const hex = [];
    for (let i = 0; i < 256; ++i) {
      hex.push(Number(i + 256).toString(16).substring(1));
    }
  
    for (let i = 0; i < 16; i++) {
      id += hex[rands[i]];
      if (i == 3 || i == 5 || i == 7 || i == 9) {
        id += "-";
      }
    }
  
    return id;
  };
}
