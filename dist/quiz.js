'use strict';

// TeX source for the original exercises and the four practice families per topic.
// The first choice in each row is the answer. The app rotates choices per card.
const quiz = (() => {
  const raw = String.raw;
  const frac = (a,b) => raw`\frac{${a}}{${b}}`;
  const integral = (a,b,f,d='x') => raw`\int_{${a}}^{${b}} ${f}\,d${d}`;
  const fx = (f,range,name='f(x)') =>
    raw`${name}=${f}\quad (${range}),\quad 0\text{ elsewhere}`;
  const cdf = (left,right,inner) => raw`\begin{cases}0 & t\le ${left}\\ ${inner} & ${left}<t<${right}\\ 1 & t\ge ${right}\end{cases}`;
  const r = (a,b) => {
    const gcd = (x,y) => y ? gcd(y,x%y) : x;
    const d = gcd(Math.abs(a),b);
    return d === b ? String(a/d) : frac(a/d,b/d);
  };
  const row = (formula,...options) => ({formula, options:options.map(String)});
  const base = [
    [
      row(integral(0,2,'(3x^2+2x)'),12,8,10,16),
      row(integral(-2,1,'(5z^2-7z+3)','z'),r(69,2),r(59,2),r(19,2),'-'+r(69,2)),
      row(fx('cx','0<x<2'),r(1,2),r(1,4),1,2),
      row(fx('3x^2','0<x<1')+raw`;\quad P(${frac(1,2)}<X<${frac(3,4)})`,r(19,64),r(27,64),r(1,4),r(35,64))
    ],
    [
      row(raw`\int 3x^2(x^3-1)^7\,dx`,frac('(x^3-1)^8',8)+'+C','(x^3-1)^8+C',frac('(x^3-1)^7',7)+'+C',frac('(x^3-1)^8',24)+'+C'),
      row(raw`\int e^{7x+5}\,dx`,frac('e^{7x+5}',7)+'+C','e^{7x+5}+C',frac('e^{7x+5}',5)+'+C','7e^{7x+5}+C'),
      row(integral(0,1,'2xe^{-x^2}'),'1-e^{-1}','e^{-1}','e^{-1}-1',frac('1-e^{-1}',2)),
      row(integral(0,2,frac('x','1+x^2')),frac(raw`\ln 5`,2),raw`\ln 5`,frac(raw`\ln 4`,2),frac(raw`\ln 3`,2))
    ],
    [
      row(fx('2x','0<x<1'),cdf(0,1,'t^2'),cdf(0,1,'t'),cdf(0,1,'2t'),cdf(0,1,'t^3')),
      row(fx(frac(1,3),'2<x<5'),cdf(2,5,frac('t-2',3)),cdf(2,5,frac('t',3)),cdf(2,5,frac('t-2',5)),cdf(2,5,frac('5-t',3))),
      row(raw`F(t)=t^3\ (0\le t\le 1);\quad P(${frac(1,4)}<X\le ${frac(1,2)})`,r(7,64),r(1,8),r(1,64),r(1,4)),
      row(fx('c(8x^3-x^4)',raw`0\le x\le 8`),r(5,8192),r(1,8192),r(1,8192*2),r(8192,5))
    ],
    [
      row(fx('2e^{-2x}',raw`x\ge 0`)+raw`;\quad P(X>1)`,'e^{-2}','1-e^{-2}','2e^{-2}','e^{-1}'),
      row(integral(1,raw`\infty`,frac(1,'x')),raw`\text{Diverges}`,0,1,raw`\ln 2`),
      row(integral(0,1,frac(1,raw`\sqrt{x}`)),2,1,4,raw`\text{Diverges}`),
      row(raw`X\sim N(10,2^2);\quad P(X>12)`,raw`1-\Phi(1)`,raw`\Phi(1)`,raw`1-\Phi(2)`,raw`\Phi(0)`)
    ],
    [
      row(integral(0,1,'xe^x'),1,0,'e-1','e'),
      row(fx('2e^{-2x}',raw`x\ge 0`),r(1,2),1,2,r(1,4)),
      row(fx('2x','0<x<1'),raw`(${r(2,3)},${r(1,18)})`,raw`(${r(2,3)},${r(1,2)})`,raw`(${r(1,2)},${r(1,12)})`,raw`(${r(2,3)},${r(1,9)})`),
      row(integral(0,raw`\infty`,'(1+2x)e^{-x}'),3,1,2,4)
    ],
    [
      row(fx('c',raw`0<x<2,\ 0<y<3`,'f(x,y)'),r(1,6),r(1,5),r(1,3),6),
      row(fx('c','0<y<x<1','f(x,y)'),2,1,r(1,2),4),
      row(fx('2','0<y<x<1','f(x,y)'),'(2x,2(1-y))','(2(1-x),2y)','(2x,2y)','(x,1-y)'),
      row(raw`(0,0),\ (1,0),\ (1,3)`,r(3,4),r(9,8),r(3,2),r(1,2))
    ]
  ];
  const inf = raw`\infty`;
  const ge0 = raw`x\ge 0`;
  const pair = (a,b) => raw`(\, ${a},\ ${b}\,)`;
  const exp = k => 'e^{'+k+'}';
  const families = [
    [
      n=>row(integral(0,n,'(3x^2+2x+1)'),n**3+n*n+n,n**3+n*n,n**3+n,n*n+n),
      n=>row(integral(n,0,'(2x+3)'),-n*n-3*n,n*n+3*n,-n*n,-3*n-1),
      n=>row(integral(1,n,raw`(${frac(2,raw`\sqrt{x}`)}+${frac(1,'x')})`),raw`4(\sqrt{${n}}-1)+\ln ${n}`,raw`2(\sqrt{${n}}-1)+\ln ${n}`,raw`4\sqrt{${n}}+\ln ${n}`,raw`4(\sqrt{${n}}-1)-\ln ${n}`),
      n=>row(integral(-n,n,'(x^3+2|x|)'),2*n*n,0,n*n,4*n*n)
    ],
    [
      n=>row(integral(0,1,raw`2x(${n}+x^2)^2`),r((n+1)**3-n**3,3),r((n+1)**3,3),(n+1)**3-n**3,r(n**3,3)),
      n=>row(raw`\int x^2e^{-${n}x^3}\,dx`,'-'+frac(exp('-'+n+'x^3'),3*n)+'+C',frac(exp('-'+n+'x^3'),3*n)+'+C','-'+frac(exp('-'+n+'x^3'),n)+'+C',exp('-'+n+'x^3')+'+C'),
      n=>row(integral(1,n,frac(raw`\ln x`,'x')),frac(raw`(\ln ${n})^2`,2),raw`(\ln ${n})^2`,raw`\ln(\ln ${n})`,raw`2(\ln ${n})^2`),
      n=>row(integral(0,1,frac(1,raw`\sqrt{${n}x+1}`)),frac(raw`2(\sqrt{${n+1}}-1)`,n),frac(raw`2\sqrt{${n+1}}`,n),raw`2(\sqrt{${n+1}}-1)`,frac(raw`\sqrt{${n+1}}-1`,n))
    ],
    [
      n=>row(fx('cx^2','0<x<'+n),pair(r(3,n**3),cdf(0,n,raw`(${frac('t',n)})^3`)),pair(r(1,n**3),cdf(0,n,raw`(${frac('t',n)})^3`)),pair(r(3,n**3),cdf(0,n,raw`(${frac('t',n)})^2`)),pair(r(3,n*n),cdf(0,n,frac('t',n)))),
      n=>row(fx(frac(raw`2(${n}-x)`,n*n),'0<x<'+n),r(1,4),r(3,4),r(1,2),r(1,8)),
      n=>row(raw`F(t)=0\ (t\le0);\quad F(t)=1-e^{-${n}t}\ (t>0)`,pair(n+exp('-'+n+'x'),exp(-n)+'-'+exp(-2*n)),pair(exp('-'+n+'x'),exp(-n)+'-'+exp(-2*n)),pair(n+exp('-'+n+'x'),'1-'+exp(-2*n)),pair(n+exp('-'+n+'x'),exp(-2*n))),
      n=>row(raw`f(x)=c\ (0<x<${n});\quad f(x)=2c\ (${n}<x<${n+2});\quad 0\text{ elsewhere}`,pair(r(n,n+4),r(n+2,n+4)),pair(r(n,n+4),r(n+1,n+4)),pair(r(n+2,n+4),r(n,n+4)),pair(0,r(2,n+4)))
    ],
    [
      n=>row(fx('c'+exp('-'+n+'x'),ge0),n,r(1,n),n*n,r(1,n*n)),
      n=>row(integral(n,inf,frac(1,'x^2')),r(1,n),r(1,n*n),n,raw`\text{Diverges}`),
      n=>row(integral(0,n,frac(1,'x')),raw`\text{Diverges}`,raw`\ln ${n}`,r(1,n),0),
      n=>row(fx(n+exp('-'+n+'x'),ge0)+raw`;\quad P(X>2\mid X>1)`,exp(-n),exp(-2*n),'1-'+exp(-n),exp(-3*n))
    ],
    [
      n=>row(integral(1,n,raw`\ln x`),raw`${n}\ln ${n}-${n-1}`,raw`${n}\ln ${n}-${n}`,raw`\ln ${n}`,raw`${n}\ln ${n}`),
      n=>row(integral(0,1,'x'+exp(n+'x')),frac(raw`${n-1}${exp(n)}+1`,n*n),frac(raw`${n-1}${exp(n)}`,n*n),frac(exp(n)+'-1',n),frac(raw`${n-1}${exp(n)}-1`,n*n)),
      n=>row(fx(n+exp('-'+n+'x'),ge0),pair(r(1,n),r(2,n*n)),pair(r(1,n),r(1,n*n)),pair(n,2*n*n),pair(r(1,n),r(3,n*n))),
      n=>row(fx(frac(1,n),'0<x<'+n),pair(r(n,2),r(n*n,12)),pair(r(n,2),r(n*n,3)),pair(r(n,2),r(n*n,6)),pair(n,r(n*n,12)))
    ],
    [
      n=>row(fx('cxy',raw`0<x<${n},\ 0<y<2`,'f(x,y)'),r(1,n*n),r(2,n*n),r(1,n*n*2),n*n),
      n=>row(fx(frac(2,n*n),'0<y<x<'+n,'f(x,y)'),pair(frac('2x',n*n),frac('2('+n+'-y)',n*n)),pair(frac('2('+n+'-x)',n*n),frac('2y',n*n)),pair(frac('2x',n*n),frac('2y',n*n)),pair(frac('x',n*n),frac(n+'-y',n*n))),
      n=>row(fx(frac(1,n),raw`0<x<${n},\ 0<y<1`,'f(x,y)')+raw`;\quad P(Y<${frac('X',n)})`,r(1,2),r(1,4),r(3,4),1),
      n=>{
        const option = (a,b,f) => raw`${integral(0,1,integral(a,b,'y')+raw`\,`,'y')}=${f}`;
        return row(integral(0,n,integral(frac('x',n),1,'y','y')+raw`\,`),option(0,n+'y',r(n,3)),option(0,n+'y',r(n,2)),option(n+'y',n,r(n,6)),option(0,n,r(n,2)));
      }
    ]
  ];
  return base.map((items,i)=>[...items,...families[i].flatMap(make=>[2,3,4,5].map(make))]);
})();
