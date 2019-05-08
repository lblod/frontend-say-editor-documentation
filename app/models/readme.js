import { tracked } from '@glimmer/tracking';

export default class Readme {
  @tracked markdown;
  @tracked namespace;
  @tracked repository;

  constructor(markdown, namespace, repository) {
    this.markdown = markdown;
    this.namespace = namespace;
    this.repository = repository;
  }

  get repositoryPath() {
    return `${this.namespace}/${this.repository}`;
  }
}
