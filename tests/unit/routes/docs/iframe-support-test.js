import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | docs/iframe-support', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:docs/iframe-support');
    assert.ok(route);
  });
});
