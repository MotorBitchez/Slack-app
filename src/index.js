import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom'; 
import {injectGlobal} from 'emotion';
import axios from 'axios';
import {SlackApp} from './components/slackApp';
import Futura from './fonts/Futura.ttc';

injectGlobal`
  * {
    box-sizing: border-box;
    font-family: 'Futura', sans-serif;
  }
  html, body {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    font-size: 20px;
    background-color: white;
  }
  #app{
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 350px 1fr; 
    justify-content: center;
    align-items: center;
    background-color: white;
  }
  @font-face {
    font-family: 'Futura';
    src: url(${Futura}) format('truetype');
  }
`;

function App (props){
  const [infoCounter, setInfoCounter] = useState(0);
  const [count, setCount] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [content, setContent] = useState(false);
  useEffect(() => {
    axios.get('/count')
      .then(res => {
        if (count !== res.data.count) {
          setCount(res.data.count);
        }
        setInfoCounter(infoCounter + 1);
      })
      .catch(err => {
        console.log('Error Count: ', err.message);
        setInfoCounter(infoCounter + 1);
      });
  }, [infoCounter]);
  useEffect(() => {
    axios.get('/info')
      .then(res => {
        setContent(res.data);
        setFetched(true);
      })
      .catch((err) => {
        console.log('Error Info: ', err.message);
        setFetched(false);
      })
  }, [count]);

  if (!fetched) return (
    <div style={{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div>Slack Verileri Yükleniyor...</div>
    </div>
  );

  if (!content.data) return (
    <div style={{width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div>Bir Hata Oluştu</div>
    </div>
  );

  return <SlackApp key={count} content={content} />;
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);