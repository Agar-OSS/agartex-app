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

const LatexExampleDoc = `
\\documentclass[a4paper, 12pt]{article}

\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{amsthm,amsmath,amssymb,amsfonts}
\\usepackage[polish]{babel}
\\usepackage{polski}

% Random comment
\\begin{align*}
  Illegal math mode (should not be highlighted)
\\end{align*}

\\newgeometry{tmargin=2.5cm, bmargin=2cm, rmargin=1cm, lmargin=1cm}

\\pagestyle{fancy}
\\fancyhf{}

\\begin{document}

\\maketitle

Some text

\\begin{align*}
  Some random math text = \\lambda
\\end{align*}

% Random comment

\\end{document}

% Random comment
Illegal text
`;

export { LatexGrammar, LatexExampleDoc };
