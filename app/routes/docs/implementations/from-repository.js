import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class DocsImplementationsFromRepositoryRoute extends Route {
  @service repository;

  model({namespace, repository}){
    return this.repository.fetchReadme(namespace, repository);
  }
}
