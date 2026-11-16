'use strict';

// Render the TeX commands used by the bank as native, offline MathML.
// Keep the source in a semantics annotation for tools that consume TeX.
function renderMath(source, display = false) {
  const namespace = 'http://www.w3.org/1998/Math/MathML';
  const node = (tag, ...children) => {
    const item = document.createElementNS(namespace, tag);
    item.append(...children);
    return item;
  };
  const operators = {int:'∫', sim:'∼', infty:'∞', le:'≤', ge:'≥', mid:'∣', times:'×', cdot:'·', pm:'±'};
  const identifiers = {Phi:'Φ', mu:'μ', sigma:'σ', pi:'π', epsilon:'ε', theta:'θ'};
  let i = 0;

  function blanks() {
    while (/\s/.test(source[i] || '')) i++;
  }
  function space(width) {
    const item = node('mspace');
    item.setAttribute('width', width);
    return item;
  }
  function text() {
    blanks();
    const end = source.indexOf('}', i + 1);
    if (source[i] !== '{' || end < 0) throw Error('Expected a text group.');
    const value = source.slice(i + 1, end);
    i = end + 1;
    return node('mtext', value.replaceAll(' ', '\u00a0'));
  }
  function cases() {
    if (!source.startsWith('{cases}', i)) throw Error('Expected a cases environment.');
    const endMarker = String.raw`\end{cases}`;
    const tail = source.indexOf(endMarker, i + 7);
    if (tail < 0) throw Error('Unclosed cases environment.');
    const rows = source.slice(i + 7, tail).split(String.raw`\\`).map(line =>
      node('mtr',...line.split('&').map(cell => node('mtd',renderMath(cell.trim()).firstChild.firstChild))));
    i = tail + endMarker.length;
    const table = node('mtable', ...rows);
    table.setAttribute('columnalign','left left');
    return node('mrow',node('mo','{'),table);
  }
  function atom() {
    blanks();
    const char = source[i++];
    if (char === undefined) throw Error('Missing math token.');
    if (char === '{') {
      const contents = sequence();
      if (source[i++] !== '}') throw Error('Unclosed group.');
      return contents;
    }
    if (char === '\\') {
      const command = /^[a-zA-Z]+/.exec(source.slice(i))?.[0] || source[i];
      i += command?.length || 0;
      if (command === 'begin') return cases();
      if (command === 'frac') return node('mfrac', atom(), atom());
      if (command === 'sqrt') return node('msqrt', atom());
      if (command === 'text') return text();
      if (command === 'quad') return space('1em');
      if (command === ',' || command === ' ') return space('.22em');
      if (Object.hasOwn(operators,command)) return node('mo',operators[command]);
      if (Object.hasOwn(identifiers,command)) return node('mi',identifiers[command]);
      if (['ln','log','exp','sin','cos'].includes(command)) return node('mi',command);
      throw Error('Unsupported TeX command: '+command);
    }
    if (/\d/.test(char)) {
      const rest = /^\d*(?:\.\d+)?/.exec(source.slice(i))[0];
      i += rest.length;
      return node('mn',char+rest);
    }
    if (/[a-zA-Z]/.test(char)) return node('mi',char);
    return node('mo',char === '-' ? '−' : char);
  }
  function sequence() {
    const items = [];
    blanks();
    while (i < source.length && source[i] !== '}') {
      const base = atom();
      let sub, sup;
      blanks();
      while (source[i] === '_' || source[i] === '^') {
        const kind = source[i++];
        if (kind === '_') sub = atom();
        else sup = atom();
        blanks();
      }
      items.push(sub && sup ? node('msubsup',base,sub,sup) :
        sub ? node('msub',base,sub) : sup ? node('msup',base,sup) : base);
    }
    return node('mrow',...items);
  }

  const contents = sequence();
  if (i !== source.length) throw Error('Unexpected closing group.');
  const annotation = node('annotation',source);
  annotation.setAttribute('encoding','application/x-tex');
  const math = node('math',node('semantics',contents,annotation));
  if (display) math.setAttribute('display','block');
  return math;
}
