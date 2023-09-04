import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DocsCoreFromRepositoryRoute extends Route {
  @service repository;

  async model({namespace, repository}){
    return this.repository.fetchReadme(namespace, repository);
  }
}
