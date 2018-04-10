const Pkg    = require('./../package.json');

const IsIP   = require('is-ip');
const Url    = require ('url');
const Dohdec = require('dohdec');
const Fetch  = require('node-fetch');

const TYPES = {
  DNS_PROVIDERS: {
    GOOGLE: 'GOOGLE',
    CLOUDFLARE: 'CLOUDFLARE',
  },
  DNS_OVER_HTTPS: {
    GOOGLE: 'https://dns.google.com/resolve'
  }
};

class Fdoh {
  _randomItemInArray (items = []) {
    return ~~(Math.floor(Math.random() * items.length));
  }

  version () {
    return Pkg.version;
  }

  set () {
    let ctx = this;
    return async (uri, options = {}, provider = TYPES.DNS_PROVIDERS.CLOUDFLARE, respondWithConfig = false) => {
      options = options ? options : {};
      if (!uri) return Promise.reject(`You must provide a URI`);

      let _url = Url.parse(uri);
      if (IsIP(_url.hostname)) {
        if (respondWithConfig) {
          return {uri: uri, headers: {}};
        } else {
          return Fetch(uri, options);
        }
      }

      const _dnsRequest = (provider === TYPES.DNS_PROVIDERS.CLOUDFLARE) ?
                          await Dohdec(_url.hostname) :
                          await Dohdec(_url.hostname, {
                            url: TYPES.DNS_OVER_HTTPS[TYPES.DNS_PROVIDERS.GOOGLE]
                          });

      if ( !(_dnsRequest && _dnsRequest.Answer && _dnsRequest.Answer.length > 0) ) {
        return Promise.reject(`Unable to resolve DNS for ${uri}`);
      }

      const _headers = {
        Host: _url.hostname
      };

      const _fetchOptions = Object.assign(options, {
        headers: _headers
      });

      const _roundRobin              = ctx._randomItemInArray(_dnsRequest.Answer);
      const _roundRobinDnsResolution = _dnsRequest.Answer[_roundRobin];

      _url.hostname = _roundRobinDnsResolution.data;
      if (_url.host) delete _url.host;

      if (respondWithConfig) {
        return {url: Url.format(_url), headers: _headers};
      } else {
        return Fetch(Url.format(_url), _fetchOptions);
      }
    };

  }

}

module.exports = Fdoh;
