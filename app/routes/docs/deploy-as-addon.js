import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DocsDeployAsAddonRoute extends Route {
  @service repository;

  async model(){
    return this.repository.fetchReadme('lblod', 'say-editor-as-addon-tutorial');
  }
}
