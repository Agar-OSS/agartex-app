import * as monaco from 'monaco-editor';

// Based on:
// * https://microsoft.github.io/monaco-editor/monarch.html
// * https://github.com/textmate/latex.tmbundle

const LatexGrammar: monaco.languages.IMonarchLanguage = {
  // defaultToken: 'invalid', // Uncomment for easier development

  tokenizer: {
    root: [
      { include: '@begin' },
    ],

    'mathmode': [
      [
        /(\\end)({)(\w+\*?)(})/, {
          cases: {
            '$S2==$3': [
              'keyword',
              'delimiter.curly',
              { token: 'identifier.$3', bracket: '@close', next: '@pop'},
              'delimiter.curly',
            ],
            '@default': 'string.mathmode'
          }
        }
      ],
      [ /.+/, 'string.mathmode' ]
    ],
    
    begin: [
      [
        /(\\begin)({)((?:align|equation|eqnarray|multline|aligned|alignat|split|gather|gathered)\*?)(})/, [
          'keyword',
          'delimiter.curly',
          { token: 'identifier.$3', bracket: '@open', next: '@mathmode.$3'},
          'delimiter.curly',
        ]
      ]
    ]
  }
};

export default LatexGrammar;
