import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DocsDeployAsLibraryRoute extends Route {
  @service repository;

  async model(){
    return this.repository.fetchReadme('lblod', 'frontend-embeddable-notule-editor');
  }
}
