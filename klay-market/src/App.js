import logo from './logo.svg';
import { getBalance, readNumber, setNumber } from './api/UseCaver';
import './App.css';

function App() {
  //readNumber();
  getBalance('0x860ab241a263ee4445d6ee2cb6cc5c9d2d5cbcff');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button title={'카운트 변경'} onClick={()=>{setNumber(100)}} />
        <p>
          Klaytn <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
