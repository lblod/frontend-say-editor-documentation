import githubReadmeUrl from 'frontend-rdfa-editor-documentation/utils/github-readme-url';
import { module, test } from 'qunit';

module('Unit | Utility | github-readme-url', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = githubReadmeUrl();
    assert.ok(result);
  });
});
