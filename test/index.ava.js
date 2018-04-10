const Ava  = require('ava');

const Fdoh = require('./../index');
const _Fdoh = require('./../lib/fdoh');

Ava('Fdoh Instance', t => {
  const INSTANCE = new _Fdoh();
  t.deepEqual(INSTANCE.set(), Fdoh);
  t.pass('Instantiated Instance is correct');
});
