// Use this lodash wrapper if you need to chain methods.
// Ensure the methods you need is included in the mixin.

import chain from 'lodash/chain';
import compact from 'lodash/compact';
import first from 'lodash/first';
import get from 'lodash/get';
import map from 'lodash/map';
import mixin from 'lodash/mixin';
import split from 'lodash/split';
import toLower from 'lodash/toLower';
import value from 'lodash/value';
import wrapperLodash from 'lodash/wrapperLodash';

const _ = mixin(wrapperLodash, {
  chain,
  compact,
  first,
  get,
  map,
  split,
  toLower,
});

// .value() cannot be inserted inside mixin
_.prototype.value = value;

export default _;
