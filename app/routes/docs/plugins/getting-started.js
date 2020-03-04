import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class DocsPluginsGettingStartedRoute extends Route {
  async model(){
    const request = await fetch("/assets/pages/getting-started.md");
    return await request.text();
  }
}
