import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | docs/plugins/getting-started', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:docs/plugins/getting-started');
    assert.ok(controller);
  });
});
