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

  const mathButtonLabels = ["+", "-", "*", "/", "."];
  const mathButtonIds = ["add", "subtract", "multiply", "divide", "decimal"];
  
  const handleMathClick = (label: string) => {
    setReadout((prev) => {
      // If the previous character is an operator and the current label is also an operator
      if (/[+\-*/]$/.test(prev) && /[+\-*/]/.test(label)) {
        // Handle the case where '-' is entered after an operator (as a negative sign)
        if (label === '-' && !/[+\-*/]-$/.test(prev)) {
          return prev + label; // Allow "-" as a negative sign after an operator
        } else if (/[+\-*/]-$/.test(prev) && label !== '-') {
          // If the previous input is an operator followed by "-", replace the operator (but preserve the negative sign)
          return prev.slice(0, -2) + label;
        } else {
          // Replace the last operator with the new one
          return prev.slice(0, -1) + label;
        }
      } else {
        // Handle decimals: ensure only one decimal is allowed per number
        if (label === '.') {
          const lastNumber = prev.split(/[\+\-\*\/]/).pop();
          if (lastNumber && lastNumber.includes('.')) {
            return prev; // Do not allow more than one decimal per number
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
    setReadout((prev) => prev === '0' ? label.toString() : prev + label.toString());
  };

  const numButtons = numButtonIds.map((id, i) => (
    <NumButton key={i} label={i} id={id} onClick={() => handleNumClick(i)} />
  ));

  const handleClearClick = () => {
    setReadout('0'); // This correctly resets the display value to '0'
  };

  const handleEnterClick = () => {
    const result = evaluate(readout)
    setReadout(result.toString()); // Temporary: this resets the display value
  };

  return (
    <>

      <div className="App">
        <h1>This is a calculator</h1>
        <div id="display"> {/* Wrapper div */}
          <div id="readout"> 
            {readout}
          </div>
        </div>
        {numButtons}
        {mathButtons}
        <button id="clear" onClick={handleClearClick}>Clear</button>
        <button id="equals" onClick={handleEnterClick}>=</button>
      </div>
    </>
  );
}

export default App;