import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class DocsMenuComponent extends Component {
  @tracked core = [
    {
      label: 'RDFa editor',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor',
    },
    {
      label: 'Embeddable',
      namespace: 'lblod',
      repository: 'frontend-embeddable-notule-editor',
    },
  ];

  @tracked existingImplementations = [
    {
      label: 'Gelinkt Notuleren',
      namespace: 'lblod',
      repository: 'app-gelinkt-notuleren',
    },
  ];

  @tracked plugins = [
    {
      label: 'LBLOD related plugins',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-lblod-plugins',
    },
  ];
}
