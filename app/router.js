import EmberRouter from "@ember/routing/router";
import config from "./config/environment";

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('demo');
  this.route('docs', function() {
    this.route('core', function() {
      this.route('from-repository', { path: ":namespace/:repository" });
    });
    this.route('plugins', function() {
      this.route('from-repository', { path: ":namespace/:repository" });
      this.route('implement-your-own');
      this.route('reuse-of-data');
      this.route('getting-started');
    });
    this.route('iframe-support');
    this.route('core-development');
    this.route('deploy-as-addon');
    this.route('deploy-as-library');

    this.route('implementations', function() {
      this.route('from-repository', { path: ":namespace/:repository" });
    });
  });
  this.route('cases');
  this.route('features');
  this.route('ui-kit');
  this.route('about');

  this.route('implementations', function() {});
});

export default Router;
