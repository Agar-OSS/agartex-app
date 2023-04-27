import * as monaco from 'monaco-editor';

// Based on:
// * https://microsoft.github.io/monaco-editor/monarch.html
// * https://github.com/textmate/latex.tmbundle

const LatexGrammar: monaco.languages.IMonarchLanguage = {
  // defaultToken: 'invalid', // Uncomment for easier development

  tokenizer: {
    root: [
      { include: '@comment' },
      { include: '@documentClass' }
    ],

    // Comment

    comment: [
      [
        /%.*$/, 'comment'
      ]
    ],

    // Document structure

    documentClass: [
      { include: '@comment' },
      [
        /(\\documentclass)(\{)(.*)(\})/, [
          'keyword',
          'delimiter.curly',
          { token: 'identifier', next: '@preamble' },
          'delimiter.curly'
        ]
      ],
      [
        /(\\documentclass)(\[)(.*)(\])(\{)(.*)(\})/, [
          'keyword',
          'delimiter.square',
          'tag.options',
          'delimiter.square',
          'delimiter.curly',
          { token: 'identifier', next: '@preamble' },
          'delimiter.curly'
        ]
      ]
    ],

    preamble: [
      { include: '@comment' },
      [
        /(\\usepackage)(\{)(.*)(\})/, [
          'keyword',
          'delimiter.curly',
          'identifier',
          'delimiter.curly'
        ]
      ],
      [
        /(\\usepackage)(\[)(.*)(\])(\{)(.*)(\})/, [
          'keyword',
          'delimiter.square',
          'tag.options',
          'delimiter.square',
          'delimiter.curly',
          'identifier',
          'delimiter.curly'
        ]
      ],
      [
        /(\\begin)(\{)(document)(\})/, [
          'keyword',
          'delimiter.curly',
          { token: 'identifier', next: '@document' },
          'delimiter.curly'
        ], '@document'
      ]
    ],

    document: [
      { include: '@comment' },
      { include: '@begin.mathmode.keyword' },
      [
        /(\\end)(\{)(document)(\})/, [
          'keyword',
          'delimiter.curly',
          { token: 'identifier', next: '@eof' },
          'delimiter.curly'
        ]
      ]
    ],

    eof: [
      { include: '@comment' },
      [ /.+/, 'invalid' ]
    ],

    // Mathmode
    
    mathmode: [
      [ /.+/, 'string.mathmode' ]
    ],

    'mathmode.keyword': [
      { include: '@comment' },
      [
        /(\\end)({)(\w+\*?)(})/, {
          cases: {
            '$S3==$3': [
              'keyword',
              'delimiter.curly',
              { token: 'identifier.$3', bracket: '@close', next: '@pop'},
              'delimiter.curly',
            ],
            '@default': 'string.mathmode'
          }
        }
      ],
      { include: '@mathmode' }
    ],

    'begin.mathmode.keyword': [
      [
        /(\\begin)({)((?:align|equation|eqnarray|multline|aligned|alignat|split|gather|gathered)\*?)(})/, [
          'keyword',
          'delimiter.curly',
          { token: 'identifier.$3', bracket: '@open', next: '@mathmode.keyword.$3'},
          'delimiter.curly',
        ]
      ]
    ]
  }
};

export default LatexGrammar;
