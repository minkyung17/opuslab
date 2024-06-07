'use strict';

module.exports = {
  plugins: ['plugins/markdown'],
  recurseDepth: 10,
  source: {
    include: ['./src'],
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '(^|\\/|\\\\)_'
  },
  sourceType: 'module',
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure']
  },
  templates: {
    cleverLinks: false,
    monospaceLinks: false
  },
  opts: {
    template: 'templates/default',  // same as -t templates/default
    encoding: 'utf8',               // same as -e utf8
    destination: './documentation/',          // same as -d ./documentation/
    recurse: true                  // same as -r
  }
};
