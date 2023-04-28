import * as monaco from 'monaco-editor';

// Based on:
// * https://microsoft.github.io/monaco-editor/monarch.html
// * https://github.com/textmate/latex.tmbundle

// TODO: lazy import
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
      
      [
        /(\\begin)({)((?:align|equation|eqnarray|multline|aligned|alignat|split|gather|gathered)\*?)(})/, [
          'keyword',
          'delimiter.curly',
          { token: 'identifier.$3', bracket: '@open', next: '@mathmode.keyword.$3'},
          'delimiter.curly',
        ]
      ],
      [ /\$\$/, { token: 'string.mathmode.block', bracket: '@open', next: '@mathmode.block.dollar' } ],
      [ /\\\[/, { token: 'string.mathmode.block', bracket: '@open', next: '@mathmode.block.bracket' } ],
      [ /\$/, { token: 'string.mathmode.inline', bracket: '@open', next: '@mathmode.inline.dollar' } ],
      [ /\\\(/, { token: 'string.mathmode.inline', bracket: '@open', next: '@mathmode.inline.bracket' } ],

      { include: '@block' },

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
      [ /[^$\\]+/, 'string.mathmode' ],
      [ /\\\\/, 'string.mathmode.special' ],
      [ /\$|\\/, 'string.mathmode.special' ]
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

    'mathmode.inline.dollar': [
      { include: '@comment' },
      [ /\\\$/, 'string.mathmode.special' ],
      [ /\$/, { token: 'string.mathmode.inline', bracket: '@close', next: '@pop' }],
      { include: '@mathmode' }
    ],

    'mathmode.inline.bracket': [
      { include: '@comment' },
      [ /\\\)/, { token: 'string.mathmode.inline', bracket: '@close', next: '@pop' }],
      { include: '@mathmode' }
    ],

    'mathmode.block.dollar': [
      { include: '@comment' },
      [ /\\\$/, 'string.mathmode.special' ],
      [ /\$\$/, { token: 'string.mathmode.block', bracket: '@close', next: '@pop' }],
      { include: '@mathmode' }
    ],

    'mathmode.block.bracket': [
      { include: '@comment' },
      [ /\\\]/, { token: 'string.mathmode.block', bracket: '@close', next: '@pop' }],
      { include: '@mathmode' }
    ],

    // Blocks

    block: [
      [
        /(\\begin)({)(\w+\*?)(})/, [
          'keyword',
          'delimiter.curly',
          { token: 'identifier.$3', bracket: '@close' },
          'delimiter.curly',
        ]
      ],
      [
        /(\\end)({)(\w+\*?)(})/, [
          'keyword',
          'delimiter.curly',
          { token: 'identifier.$3', bracket: '@close' },
          'delimiter.curly',
        ]
      ]
    ]
  }
};

// TODO: move to separate file or remove
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

\\begin{itemize}
  \\item $\\frac{1}{2}$
\\end{itemize}

Inline mathmode $\\alpha + \\beta = \\$ and more math$ test and \\( more test \\) and testing.

Mathmode block
$$
\\gamma = $
$$

Midtext

\\[
\\gamma = $
\\]

\\begin{align*}
  Some random math text = \\lambda
\\end{align*}

% Random comment

\\end{document}

% Random comment
Illegal text
`;

export { LatexGrammar, LatexExampleDoc };
