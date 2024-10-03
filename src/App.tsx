import { useState } from 'react';
import { evaluate } from 'mathjs';
import './App.css';

function NumButton({ label, id, onClick }: { label: number; id: string; onClick: () => void }) {
  return (
    <button id={id} className="num-button" onClick={onClick}>
      {label}
    </button>
  );
}

function MathButton({ label, id, onClick }: { label: string; id: string; onClick: () => void }) {
  return (
    <button id={id} className="math-button" onClick={onClick}>
      {label}
    </button>
  );
}

function App() {
  const [readout, setReadout] = useState('0');
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
  };

  const mathButtonLabels = ["+", "-", "*", "/", "."];
  const mathButtonIds = ["add", "subtract", "multiply", "divide", "decimal"];

  const handleMathClick = (label: string) => {
    setReadout((prev) => {
      if (/[+\-*/]$/.test(prev) && /[+\-*/]/.test(label)) {
        if (label === '-' && !/[+\-*/]-$/.test(prev)) {
          return prev + label;
        } else if (/[+\-*/]-$/.test(prev) && label !== '-') {
          return prev.slice(0, -2) + label;
        } else {
          return prev.slice(0, -1) + label;
        }
      } else {
        if (label === '.') {
          const lastNumber = prev.split(/[\+\-\*\/]/).pop();
          if (lastNumber && lastNumber.includes('.')) {
            return prev;
          }
        }
        return prev + label;
      }
    });
  };

  const mathButtons = mathButtonLabels.map((label, i) => (
    <MathButton key={i} label={label} id={mathButtonIds[i]} onClick={() => handleMathClick(label)} />
  ));

  const numButtonIds = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

  const handleNumClick = (label: number) => {
    setReadout((prev) => (prev === '0' ? label.toString() : prev + label.toString()));
  };

  const numButtons = numButtonIds.map((id, i) => (
    <NumButton key={i} label={i} id={id} onClick={() => handleNumClick(i)} />
  ));

  const handleClearClick = () => {
    setReadout('0');
  };

  const handleEnterClick = () => {
    const result = evaluate(readout);
    setReadout(result.toString());
  };

  return (
    <div className={`App ${theme}-theme`}>
      <div className="calcContainer noise">
        <h1>Stranger Calculator</h1>
        <div className="calculator">
          <div className="display" id="display">
            <div id="readout">{readout}</div>
          </div>
          <div className="buttons">
            {numButtons}
            {mathButtons}
            <button id="clear" onClick={handleClearClick}>Clear</button>
            <button id="equals" onClick={handleEnterClick}>=</button>
            <button id="upside-down" onClick={toggleTheme}>{theme === 'light' ? 'The Upside Down' : 'Hawkins'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
