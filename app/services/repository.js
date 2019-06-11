import Service from '@ember/service';
import fetch from 'fetch';
import Readme from 'frontend-say-editor-documentation/models/readme';
import readmeUrl from 'frontend-say-editor-documentation/utils/github-readme-url';

export default class RepositoryService extends Service {
  async fetchReadme(namespace, repository) {
    const url = readmeUrl(`${namespace}/${repository}`);
    const response = await fetch(url);
    const markdown = await response.text();
    return new Readme(markdown, namespace, repository);
  }
}
