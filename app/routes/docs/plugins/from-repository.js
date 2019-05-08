import Route from '@ember/routing/route';
import fetch from 'fetch';
import Readme from 'frontend-rdfa-editor-documentation/models/readme';
import readmeUrl from 'frontend-rdfa-editor-documentation/utils/github-readme-url';

export default class DocsPluginsFromRepositoryRoute extends Route {
  async model({namespace, repository}){
    const url = readmeUrl(`${namespace}/${repository}`);
    const response = await fetch(url);
    const markdown = await response.text();
    return new Readme(markdown, namespace, repository);
  }
}
