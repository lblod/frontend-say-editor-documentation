import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | docs/plugins/tuto-with-full-example', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:docs/plugins/tuto-with-full-example');
    assert.ok(controller);
  });
});
