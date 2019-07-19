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
    });
    this.route('iframe-support');
  });
  this.route('cases');
  this.route('features');
});

export default Router;
