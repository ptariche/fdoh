# FDOH

[![npm version](https://img.shields.io/npm/v/fdoh.svg?style=flat-square)](https://www.npmjs.org/package/fdoh)
[![Build Status](https://travis-ci.org/ptariche/fdoh.svg?branch=master)](https://travis-ci.org/ptariche/fdoh)
[![Coverage Status](https://coveralls.io/repos/github/ptariche/fdoh/badge.svg?branch=master)](https://coveralls.io/github/ptariche/fdoh?branch=master)

### Fetch with DNS over HTTPS

The point of this utility is to be able to utilize fetch with your DNS queries running over HTTPS from Cloudflare [1.1.1.1](https://1.1.1.1) or Google DNS over HTTPS.

### Fetch Example 
- [Link](./examples/fetch.js)

### As Axios Interceptor
Utilization of this can also be added as an [axios plugin](./examples/axios.js).

### Installation

```js
npm install --save fdoh
```

### Usage of Primary Class
- *Fdoh*
	* Arguments
		+ **url** {String}(Fetch API Url)
		+ **options** {Object}(Fetch API Object)
		+ **provider** {String}(GOOGLE or CLOUDFLARE. Defaulted to Cloudflare)
		+ **responseWithConfig** {Boolean} (Utilized to return a basic config for middleware or interceptor libraries)

	* Returns {Optional Object or Function-Object}
		+ if responseWithConfig is not passed, [Node-Fetch](https://github.com/bitinn/node-fetch) is returned
		+ if responseWithConfig is set to true, an object is returned
			+ *Object*
				+ uri {String}
				+ headers {Object}

