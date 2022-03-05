import functionPlot from 'function-plot';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { parse } from 'mathjs';
import './App.css';

function useFunction() {
  const [input, setInput] = useState('');
  let parsed;
  try {
    parsed = parse(input);
  } catch (error) {
    return [false, input, setInput];
  }
  const variables = findVariable(parsed);
  if (_.isEqual(variables, ['x']) || (_.isEmpty(variables) && _.trim(input))) {
    return [true, input, setInput];
  }
  return [false, input, setInput];
}

function findVariable(expr) {
  if (expr.name) {
    return [expr.name];
  }
  if (expr.args) {
    return _.reduce(expr.args, (acc, subExpr) => _.union(acc, findVariable(subExpr)), []);
  }
  return [];
}

function App() {
  const [isFn, input, setInput] = useFunction('');
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const options = {
      target: '#graph',
      width: 800,
      height: 800,
      grid: true,
      data: isFn
        ? [{ fn: _.trim(input), graphType: 'polyline' }]
        : [{ fn: '100000000000' }],
    };
    if (!chart) {
      setChart(functionPlot(options));
    } else {
      chart.options = options;
      chart.build();
      chart.draw();
      setChart(chart);
    }
  }, [isFn, input]);

  return (
    <div className='App'>
      <div id='graph'></div>
      <div style={{marginTop: '30px'}}>
        <input onChange={e => setInput(e.target.value)} value={input} />
      </div>
      <div style={{marginTop: '30px'}}>
        <span>Example: <pre>x^2+3</pre></span>
      </div>
    </div>
  );
}

export default App;
