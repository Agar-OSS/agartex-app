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
      [ /(\\)(s(s(earrow|warrow|lash)|h(ort(downarrow|uparrow|parallel|leftarrow|rightarrow|mid)|arp)|tar|i(gma|m(eq)?)|u(cc(sim|n(sim|approx)|curlyeq|eq|approx)?|pset(neq(q)?|plus(eq)?|eq(q)?)?|rd|m|bset(neq(q)?|plus(eq)?|eq(q)?)?)|p(hericalangle|adesuit)|e(tminus|arrow)|q(su(pset(eq)?|bset(eq)?)|c(up|ap)|uare)|warrow|m(ile|all(s(etminus|mile)|frown)))|h(slash|ook(leftarrow|rightarrow)|eartsuit|bar)|R(sh|ightarrow|e|bag)|Gam(e|ma)|n(s(hort(parallel|mid)|im|u(cc(eq)?|pseteq(q)?|bseteq))|Rightarrow|n(earrow|warrow)|cong|triangle(left(eq(slant)?)?|right(eq(slant)?)?)|i(plus)?|u|p(lus|arallel|rec(eq)?)|e(q|arrow|g|xists)|v(dash|Dash)|warrow|le(ss|q(slant|q)?|ft(arrow|rightarrow))|a(tural|bla)|VDash|rightarrow|g(tr|eq(slant|q)?)|mid|Left(arrow|rightarrow))|c(hi|irc(eq|le(d(circ|S|dash|ast)|arrow(left|right)))?|o(ng|prod|lon|mplement)|dot(s|p)?|u(p|r(vearrow(left|right)|ly(eq(succ|prec)|vee(downarrow|uparrow)?|wedge(downarrow|uparrow)?)))|enterdot|lubsuit|ap)|Xi|Maps(to(char)?|from(char)?)|B(ox|umpeq|bbk)|t(h(ick(sim|approx)|e(ta|refore))|imes|op|wohead(leftarrow|rightarrow)|a(u|lloblong)|riangle(down|q|left(eq(slant)?)?|right(eq(slant)?)?)?)|i(n(t(er(cal|leave))?|plus|fty)?|ota|math)|S(igma|u(pset|bset))|zeta|o(slash|times|int|dot|plus|vee|wedge|lessthan|greaterthan|m(inus|ega)|b(slash|long|ar))|d(i(v(ideontimes)?|a(g(down|up)|mond(suit)?)|gamma)|o(t(plus|eq(dot)?)|ublebarwedge|wn(harpoon(left|right)|downarrows|arrow))|d(ots|agger)|elta|a(sh(v|leftarrow|rightarrow)|leth|gger))|Y(down|up|left|right)|C(up|ap)|u(n(lhd|rhd)|p(silon|harpoon(left|right)|downarrow|uparrows|lus|arrow)|lcorner|rcorner)|jmath|Theta|Im|p(si|hi|i(tchfork)?|erp|ar(tial|allel)|r(ime|o(d|pto)|ec(sim|n(sim|approx)|curlyeq|eq|approx)?)|m)|e(t(h|a)|psilon|q(slant(less|gtr)|circ|uiv)|ll|xists|mptyset)|Omega|D(iamond|ownarrow|elta)|v(d(ots|ash)|ee(bar)?|Dash|ar(s(igma|u(psetneq(q)?|bsetneq(q)?))|nothing|curly(vee|wedge)|t(heta|imes|riangle(left|right)?)|o(slash|circle|times|dot|plus|vee|wedge|lessthan|ast|greaterthan|minus|b(slash|ar))|p(hi|i|ropto)|epsilon|kappa|rho|bigcirc))|kappa|Up(silon|downarrow|arrow)|Join|f(orall|lat|a(t(s(emi|lash)|bslash)|llingdotseq)|rown)|P(si|hi|i)|w(p|edge|r)|l(hd|n(sim|eq(q)?|approx)|ceil|times|ightning|o(ng(left(arrow|rightarrow)|rightarrow|maps(to|from))|zenge|oparrow(left|right))|dot(s|p)|e(ss(sim|dot|eq(qgtr|gtr)|approx|gtr)|q(slant|q)?|ft(slice|harpoon(down|up)|threetimes|leftarrows|arrow(t(ail|riangle))?|right(squigarrow|harpoons|arrow(s|triangle|eq)?))|adsto)|vertneqq|floor|l(c(orner|eil)|floor|l|bracket)?|a(ngle|mbda)|rcorner|bag)|a(s(ymp|t)|ngle|pprox(eq)?|l(pha|eph)|rrownot|malg)|V(dash|vdash)|r(h(o|d)|ceil|times|i(singdotseq|ght(s(quigarrow|lice)|harpoon(down|up)|threetimes|left(harpoons|arrows)|arrow(t(ail|riangle))?|rightarrows))|floor|angle|r(ceil|parenthesis|floor|bracket)|bag)|g(n(sim|eq(q)?|approx)|tr(sim|dot|eq(qless|less)|less|approx)|imel|eq(slant|q)?|vertneqq|amma|g(g)?)|Finv|xi|m(ho|i(nuso|d)|o(o|dels)|u(ltimap)?|p|e(asuredangle|rge)|aps(to|from(char)?))|b(i(n(dnasrepma|ampersand)|g(s(tar|qc(up|ap))|nplus|c(irc|u(p|rly(vee|wedge))|ap)|triangle(down|up)|interleave|o(times|dot|plus)|uplus|parallel|vee|wedge|box))|o(t|wtie|x(slash|circle|times|dot|plus|empty|ast|minus|b(slash|ox|ar)))|u(llet|mpeq)|e(cause|t(h|ween|a))|lack(square|triangle(down|left|right)?|lozenge)|a(ck(s(im(eq)?|lash)|prime|epsilon)|r(o|wedge))|bslash)|L(sh|ong(left(arrow|rightarrow)|rightarrow|maps(to|from))|eft(arrow|rightarrow)|leftarrow|ambda|bag)|Arrownot)\b/, 'keyword.mathmode.special' ],
      [ /(\\)(sum|prod|coprod|int|oint|bigcap|bigcup|bigsqcup|bigvee|bigwedge|bigodot|bigotimes|bogoplus|biguplus)\b/, 'keyword.mathmode.special' ],
      [ /(\\)(arccos|arcsin|arctan|arg|cos|cosh|cot|coth|csc|deg|det|dim|exp|gcd|hom|inf|ker|lg|lim|liminf|limsup|ln|log|max|min|pr|sec|sin|sinh|sup|tan|tanh)\b/, 'keyword.mathmode.special' ],
      [ /[^$\\]+/, 'string.mathmode' ],
      [ /\\\\/, 'string.mathmode.special' ],
      [ /\$|\\/, 'string.mathmode.special' ],
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
