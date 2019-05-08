import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class MainMenuComponent extends Component {
  @tracked core = [
    {
      label: 'RDFa editor',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor'
    }
  ];

  @tracked plugins = [
    {
      label: 'Agenda',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-agenda-plugin'
    },
    {
      label: 'Aanwezigen',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-aanwezigen-plugin'
    }
  ];
}
