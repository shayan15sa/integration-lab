'use strict';

// Four different problem types per topic, each with four parameter sets.
const practiceBank = (() => {
  function fraction(n, d = 1) {
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    const divisor = gcd(Math.abs(n), d);
    return d === divisor ? String(n / divisor) : (n / divisor) + '/' + (d / divisor);
  }
  function expand(families) {
    return families.flatMap(family => [2, 3, 4, 5].map(family));
  }
  return [
    expand([
      n => ['Evaluate the integral.', '∫ from 0 to '+n+' of (3x² + 2x + 1) dx', 'Integrate one term at a time.', 'The antiderivative is x³ + x² + x. Its value at 0 is 0. At '+n+' the value is '+(n**3+n**2+n)+'.'],
      n => ['Evaluate the integral with reversed limits.', '∫ from '+n+' to 0 of (2x + 3) dx', 'Use F(upper) − F(lower), even when the upper bound is smaller.', 'F(x) = x² + 3x. F(0) − F('+n+') = −'+(n*n+3*n)+'.'],
      n => ['Evaluate the integral.', '∫ from 1 to '+n+' of (2/√x + 1/x) dx', 'Use x^(−1/2) for 1/√x and ln(x) for the antiderivative of 1/x.', 'F(x) = 4√x + ln(x). The answer is 4(√'+n+' − 1) + ln('+n+').'],
      n => ['Evaluate the integral.', '∫ from −'+n+' to '+n+' of (x³ + 2|x|) dx', 'The odd term cancels over symmetric limits. Split the absolute value at 0.', 'x³ contributes 0. On [0,'+n+'], 2|x| = 2x and its integral is '+n*n+'. Double that to get '+2*n*n+'.']
    ]),
    expand([
      n => ['Use substitution with changed bounds.', '∫ from 0 to 1 of 2x('+n+' + x²)² dx', 'Set u = '+n+' + x².', 'The new bounds are '+n+' and '+(n+1)+'. Integrate u² to get ('+(n+1)+'³ − '+n+'³)/3 = '+fraction((n+1)**3-n**3,3)+'.'],
      n => ['Find an antiderivative.', '∫ x²e^(−'+n+'x³) dx', 'Set u = −'+n+'x³.', 'du = −'+3*n+'x² dx, so an antiderivative is −e^(−'+n+'x³)/'+3*n+' + C.'],
      n => ['Evaluate the integral.', '∫ from 1 to '+n+' of ln(x)/x dx', 'Set u = ln(x).', 'The new bounds are 0 and ln('+n+'). Integrating u gives (ln('+n+'))²/2.'],
      n => ['Evaluate the integral.', '∫ from 0 to 1 of 1/√('+n+'x + 1) dx', 'Set u = '+n+'x + 1 and keep track of the constant factor.', 'dx = du/'+n+'. The new bounds are 1 and '+(n+1)+'. The result is 2(√'+(n+1)+' − 1)/'+n+'.']
    ]),
    expand([
      n => ['Find the normalizing constant and the CDF.', 'f(x) = cx² on 0 < x < '+n+', and 0 elsewhere.', 'Integrate over the full interval once, then from 0 to t.', 'Total area is c·'+n+'³/3, so c = '+fraction(3,n**3)+'. The CDF is 0 for t ≤ 0, (t/'+n+')³ for 0 < t < '+n+', and 1 thereafter.'],
      n => ['Find the probability in the upper half of the interval.', 'f(x) = 2('+n+' − x)/'+n*n+' on 0 < x < '+n+', and 0 elsewhere.', 'The lower bound for this probability is '+fraction(n,2)+'.', 'The tail from a to '+n+' equals ('+n+' − a)²/'+n*n+'. Substituting a = '+fraction(n,2)+' gives 1/4.'],
      n => ['Find the density and P(1 < X < 2).', 'F(t) = 0 for t ≤ 0, 1 − e^(−'+n+'t) for t > 0.', 'Differentiate F where smooth. For the probability, subtract CDF values.', 'For x > 0 the density is '+n+'e^(−'+n+'x), and it is zero for x < 0. F(2) − F(1) = e^(−'+n+') − e^(−'+2*n+').'],
      n => ['Find the CDF at the break and one unit after it.', 'f(x) = c for 0 < x < '+n+', 2c for '+n+' < x < '+(n+2)+', and 0 elsewhere.', 'First normalize across both pieces. Preserve the area accumulated before the break.', 'Total area is ('+n+' + 4)c, so c = 1/'+(n+4)+'. F('+n+') = '+fraction(n,n+4)+' and F('+(n+1)+') = '+fraction(n+2,n+4)+'.']
    ]),
    expand([
      n => ['Find a normalizing constant for an unbounded density.', 'f(x) = ce^(−'+n+'x) for x ≥ 0, and 0 otherwise.', 'Integrate from 0 to R and let R approach infinity.', 'The total area is c/'+n+' because e^(−'+n+'R) approaches 0. Therefore c = '+n+'.'],
      n => ['Test convergence and evaluate if possible.', '∫ from '+n+' to ∞ of 1/x² dx', 'Use −1/x as an antiderivative.', 'The value through R is 1/'+n+' − 1/R. Its limit is 1/'+n+'.'],
      n => ['Test convergence at a finite singular endpoint.', '∫ from 0 to '+n+' of 1/x dx', 'Integrate from ε to '+n+' and let ε approach 0 from above.', 'The integral through the cutoff is ln('+n+') − ln(ε). This tends to infinity, so the integral diverges.'],
      n => ['Compute the conditional tail probability.', 'X has density '+n+'e^(−'+n+'x) on x ≥ 0. Find P(X > 2 | X > 1).', 'Compute each tail with an improper integral, then divide.', 'The tails at 2 and 1 are e^(−'+2*n+') and e^(−'+n+'), respectively. Their ratio is e^(−'+n+').']
    ]),
    expand([
      n => ['Evaluate by parts.', '∫ from 1 to '+n+' of ln(x) dx', 'Take u = ln(x), dv = dx.', 'The antiderivative is x ln(x) − x. Subtract its value −1 at x = 1 to get '+n+' ln('+n+') − '+(n-1)+'.'],
      n => ['Evaluate by parts.', '∫ from 0 to 1 of x e^('+n+'x) dx', 'Take u = x, dv = e^('+n+'x) dx.', 'An antiderivative is e^('+n+'x)(x/'+n+' − 1/'+(n*n)+'). The result is ('+(n-1)+'e^'+n+' + 1)/'+(n*n)+'.'],
      n => ['Find the first and second moments.', 'f(x) = '+n+'e^(−'+n+'x) on x ≥ 0, and 0 elsewhere.', 'For the second moment, choosing u = x² reduces it to the first moment.', 'Integration by parts gives E[X] = 1/'+n+'. A second application gives E[X²] = (2/'+n+')·(1/'+n+') = '+fraction(2,n*n)+'. Boundary terms vanish at infinity.'],
      n => ['Find the mean and variance.', 'f(x) = 1/'+n+' on 0 < x < '+n+', and 0 elsewhere.', 'Use the integrals of x and x², each divided by '+n+'.', 'E[X] = '+fraction(n,2)+' and E[X²] = '+fraction(n*n,3)+'. Thus Var(X) = '+fraction(n*n,12)+'.']
    ]),
    expand([
      n => ['Normalize the joint density.', 'f(x,y) = cxy for 0 < x < '+n+', 0 < y < 2, and 0 elsewhere.', 'The rectangular region lets you multiply two one-dimensional integrals.', 'The x integral is '+fraction(n*n,2)+' and the y integral is 2. Set c·'+(n*n)+' = 1, so c = 1/'+(n*n)+'.'],
      n => ['Find both marginals.', 'f(x,y) = 2/'+(n*n)+' on 0 < y < x < '+n+', and 0 elsewhere.', 'At fixed y, x ranges from y to '+n+'.', 'For 0 < x < '+n+', fₓ(x) = 2x/'+(n*n)+'. For 0 < y < '+n+', fᵧ(y) = 2('+n+' − y)/'+(n*n)+'. Both are zero off their intervals.'],
      n => ['Find the probability of a smaller triangular region.', 'f(x,y) = 1/'+n+' on 0 < x < '+n+', 0 < y < 1. Find P(y < x/'+n+').', 'For fixed x, integrate y from 0 to x/'+n+'.', 'The inner integral is x/'+(n*n)+'. Integrating from 0 to '+n+' gives 1/2.'],
      n => ['Reverse the order of integration and evaluate.', '∫ from 0 to '+n+' ∫ from x/'+n+' to 1 of y dy dx', 'The inequality y ≥ x/'+n+' is equivalent to x ≤ '+n+'y.', 'Integrate x from 0 to '+n+'y and then y from 0 to 1. The inner result is '+n+'y², giving '+fraction(n,3)+'.']
    ])
  ];
})();
