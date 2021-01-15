import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // importando bootstrap
import 'bootstrap/dist/js/bootstrap.bundle';  // importando 
import reportWebVitals from './reportWebVitals';
import Voto from './Components/Voto';

ReactDOM.render(
  <React.StrictMode>
    <Voto/>
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
