import { computed } from '@ember/object';

export default class Readme {
  constructor(markdown, namespace, repository) {
    this.markdown = markdown;
    this.namespace = namespace;
    this.repository = repository;
  }

  @computed('namespace', 'repository')
  get repositoryPath() {
    return `${this.namespace}/${this.repository}`;
  }
}
