/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  //see https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data/issues/52
  process.env.GIT_DISCOVERY_ACROSS_FILESYSTEM=1;
  let ENV = {
    build: {
      environment: 'production'
    },
    'ssh-index': { // copy and deploy index.html
      username: 'root',
      host: 'say-editor.s.redpencil.io',
      port: 22,
      remoteDir: '/data/app-say-editor-documentation-dev/documentation-app',
      allowOverwrite: true,
      agent: process.env.SSH_AUTH_SOCK
    },
    'rsync': { // copy assets
      host: 'root@say-editor.s.redpencil.io',
      port: 22,
      dest: '/data/app-say-editor-documentation-dev/documentation-app',
      delete: false,
      arg:['--verbose']
    }
  };

  if (deployTarget === 'production') {
    ENV['ssh-index']['remoteDir'] = '/data/app-say-editor-documentation/documentation-app';
    ENV['rsync']['dest'] = '/data/app-say-editor-documentation/documentation-app';
  }

  if (deployTarget === 'development') {
    ENV['ssh-index']['remoteDir'] = '/data/app-say-editor-documentation-dev/documentation-app';
    ENV['rsync']['dest'] = '/data/app-say-editor-documentation-dev/documentation-app';
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
