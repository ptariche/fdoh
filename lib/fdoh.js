require('es6-promise').polyfill();
require('isomorphic-fetch');

const Pkg   = require('./../package.json');

const IsIP  = require('is-ip');
const Url   = require ('url');
const Qs    = require('querystring');

const Fetch      = fetch;
const CT_TYPE    = 'application/dns-json';
const USER_AGENT = `${Pkg.name} v${Pkg.version}`;

const TYPES = {
  DNS_PROVIDERS: {
    GOOGLE: 'GOOGLE',
    CLOUDFLARE: 'CLOUDFLARE',
  },
  DNS_OVER_HTTPS: {
    GOOGLE: 'https://dns.google.com/resolve',
    CLOUDFLARE: 'https://cloudflare-dns.com/dns-query'
  }
};

class Fdoh {
  _randomItemInArray (items = []) {
    return ~~(Math.floor(Math.random() * items.length));
  }

  version () {
    return Pkg.version;
  }

  getDns () {
    return async (name, opts) => {
      opts = Object.assign({}, {
        rrtype: 'A',
        url: TYPES.DNS_OVER_HTTPS.CLOUDFLARE,
        name: Qs.escape(name)
      }, opts);

      opts.rrtype = opts.rrtype.toUpperCase();

      const lookup = await fetch(
        `${opts.url}?ct=${CT_TYPE}&name=${opts.name}&type=${opts.rrtype}`, {
          headers: {
            'User-Agent': USER_AGENT
          }
        });

      return lookup.json();
    };
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

      const getDns      = ctx.getDns();
      const _dnsRequest = (provider === TYPES.DNS_PROVIDERS.CLOUDFLARE) ?
                          await getDns(_url.hostname) :
                          await getDns(_url.hostname, {
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
