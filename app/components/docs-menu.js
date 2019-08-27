import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class DocsMenuComponent extends Component {

  @tracked core = [
    {
      label: 'RDFa editor',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor'
    },
    {
      label: 'Contenteditable',
      namespace: 'lblod',
      repository: 'ember-contenteditable-editor'
    },
    {
      label: 'Plugin generator',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-plugin-generator'
    },
    {
      label: 'Embeddable',
      namespace: 'lblod',
      repository: 'frontend-embeddable-notule-editor'
    }
  ];

  @tracked existingImplementations = [
     {
      label: 'Gelinkt Notuleren',
      namespace: 'lblod',
      repository: 'app-gelinkt-notuleren'
    }
  ];

  @tracked lblodPlugins = [
    {
      label: 'Aanwezigen',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-aanwezigen-plugin'
    },
    {
      label: 'Agenda',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-agenda-plugin'
    },
    {
      label: 'Aanstelling BCSD',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-bijzonder-comite-aanstelling-plugin'
    },
    {
      label: 'Citaten',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-citaten-plugin'
    },
    {
      label: 'Fractievorming',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-fractievorming-plugin'
    },
    {
      label: 'Aanstelling gemeenteraadsleden',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-gemeenteraadsleden-aanstelling-plugin'
    },
    {
      label: 'Installatievergadering',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-installatievergadering-plugin'
    },
    {
      label: 'Mandaat',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-mandaat-plugin'
    },
    {
      label: 'Mandataris',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-mandataris-plugin'
    },
    {
      label: 'Personen',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-personen-plugin'
    },
    {
      label: 'Aanstelling schepenen',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-schepenen-aanstelling-plugin'
    },
    {
      label: 'Scoped bestuursorgaan',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-scoped-bestuursorgaan-plugin'
    },
    {
      label: 'Stemming',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-stemming-module-plugin'
    },
  ];

  @tracked plugins = [
    {
      label: 'Console logger',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-console-logger-plugin'
    },
    {
      label: 'Date manipulation',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-date-manipulation-plugin'
    },
    {
      label: 'Date overwrite',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-date-overwrite-plugin'
    },
    {
      label: 'Date',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-date-plugin'
    },
    {
      label: 'Document tasklist',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-document-tasklist-plugin'
    },
    {
      label: 'Document title',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-document-title-plugin'
    },
    {
      label: 'Generic model',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-generic-model-plugin'
    },
    {
      label: 'Scroll to',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-scroll-to-plugin'
    },
    {
      label: 'Template',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-standard-template-plugin'
    },
    {
      label: 'Variables',
      namespace: 'lblod',
      repository: 'ember-rdfa-editor-template-variables-manager-plugin'
    }
  ];
}
