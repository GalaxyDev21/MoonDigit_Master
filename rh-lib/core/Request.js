const request = require('request-promise-native');
const baseUrl = 'https://api.robinhood.com';
let token;

module.exports = class Request {
  static setToken(val) {  token = val };

  static async get(url, qs, extraParams = {}) {
    return request(Object.assign({
      url: `${baseUrl}/${url}/?`,
      json: true,
      qs,
    }, extraParams))
    .then(response => {
        console.log("Get", response);
        return response;
    });
  }

  static async post(url, form, extraParams = {}) {
    return request.post(Object.assign({
      url: `${baseUrl}/${url}/`,
      json: true,
      form,
    }, extraParams))
    .then(response => {
        return response;
    });
  }

  static async getPersonal(url, qs, extraParams = {}) {
    extraParams.headers = extraParams.headers || {};
    extraParams.headers['Authorization'] = `Bearer ${token}`;
    console.log("Get with headers", url, qs, extraParams.headers);
    return this.get(url, qs, extraParams);
  }

  static async postPersonal(url, form, extraParams = {}) {
    extraParams.headers = extraParams.headers || {};
    extraParams.headers['Authorization'] = `Bearer ${token}`;
    console.log("Post with headers", url, form, extraParams.headers);
    return this.post(url, form, extraParams);
  }
}
