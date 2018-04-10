const Util  = require('./util');
const Fdoh  = require('./../index');
const Axios = require('axios');

Axios.interceptors.request.use( config => {
  return Fdoh(config.url, null, null, true)
    .then ( _config => {
      config.url     = _config.url;
      config.headers = _config.headers;
      return Promise.resolve(config);
    })
    .catch ( (err) => {
      return Promise.reject(err);
    });
});

Axios
  .get(Util.URL.NETFLIX)
  .then(response => Util._Log(response.data))
  .catch(err => Util._Error(err));
