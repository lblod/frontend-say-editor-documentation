import EmberRouter from '@ember/routing/router';
import config from 'frontend-say-editor-documentation/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('demo');
  this.route('docs', function () {
    this.route('core', function () {
      this.route('from-repository', { path: ':namespace/:repository' });
    });
    this.route('plugins', function () {
      this.route('from-repository', { path: ':namespace/:repository' });
      this.route('implement-your-own');
      this.route('reuse-of-data');
      this.route('getting-started');
      this.route('tuto-with-full-example');
    });
    this.route('iframe-support');
    this.route('core-development');
    this.route('deploy-as-addon');
    this.route('deploy-as-library');

    this.route('implementations', function () {
      this.route('from-repository', { path: ':namespace/:repository' });
    });
  });
  this.route('cases');
  this.route('features');
  this.route('ui-kit');
  this.route('about');

  this.route('implementations', function () {});
  this.route('legal', function () {
    this.route('accessibility-statement');
  });
});
