const Pkg  = require('./../package.json');

const Utls = require('./../examples/util');
const Ava  = require('ava');
const Fdoh = require('./../lib/fdoh');

const FDOH = new Fdoh();

Ava('Fdoh version', t => {
  t.truthy(FDOH.version);
  t.is(FDOH.version(), Pkg.version);
  t.pass('Version is Correctly Set');
});

Ava('Fdoh Assitance random array', t => {
  const Items = [0, 1, 2, 3, 4];
  const Item  = FDOH._randomItemInArray(Items);

  if (Items.find( (i) => i === Item)) {
    t.pass('Random Item is Set');
  } else {
    t.fail('The function did not properly get a random item in the array');
  }
});

Ava(`Expect Catch Function in Response of No URI`, async t => {
  let Fetch  = FDOH.set();
  try {
    let result = await Fetch();
    if (result) t.fail('It should have entered the catch function');
  } catch (err) {
    t.pass(err);
  }
});

Ava(`Receive Promise Rejection with Fake Website`, async t => {
  let Fetch  = FDOH.set();
  let uri    = 'https://zxcpzxcpzokxczxopczpxcopkzxc.com/';
  try {
    let result = await Fetch(uri, null);
    let text   = await result.json();
    t.fail();
  } catch (err) {
    t.is(err, `Unable to resolve DNS for ${uri}`);
    t.pass();
  }

});

Ava(`Retrieve Text Utilizing IP https://1.1.1.1/ utilizing Default`, async t => {
  let Fetch  = FDOH.set();
  let result = await Fetch('https://1.1.1.1/', null);
  let text   = await result.text();
  t.pass('Retrieved Text', text);
});

Ava(`Retrieve Config from http://1.1.1.1/ for Third Party`, async t => {
  let Fetch  = FDOH.set();
  let config = await Fetch('https://1.1.1.1/', null, null, true);
  t.pass('Retrieved Config', config);
});

Ava(`Retrieve JSON from ${Utls.URL.NETFLIX} utilizing Default (Cloudflare)`, async t => {
  let Fetch  = FDOH.set();
  let result = await Fetch(Utls.URL.NETFLIX);
  let json   = await result.json();
  t.pass('Retrieved JSON', json);
});

Ava(`Retrieve JSON from ${Utls.URL.NETFLIX} utilizing Google`, async t => {
  let Fetch  = FDOH.set();
  let result = await Fetch(Utls.URL.NETFLIX, null, 'GOOGLE');
  let json   = await result.json();
  t.pass('Retrieved JSON', json);
});

Ava(`Return Config for Third Party`, async t => {
  let Fetch  = FDOH.set();
  let result = await Fetch(Utls.URL.NETFLIX, null, null, true);
  t.pass('Retrieved Object', result);
});



