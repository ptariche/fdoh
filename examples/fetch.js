const Util  = require('./util');
const Fdoh  = require('./../index');
const Fetch = Fdoh;

Fetch(Util.URL.NETFLIX)
  .then (response => {
    response.json()
      .then( result => Util._Log(result))
      .catch ( err => Util._Error(err) );
  })
  .catch ( err => Util._Error(err) );

