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
  const [fetched, setFetched] = useState(false);
  const [content, setContent] = useState(false);
  useEffect(() => {
    axios.get('/info')
      .then(res => {
        console.log(res.data);
        setContent(res.data);
        setFetched(true);
      })
      .catch((err) => {
        console.log('Error: ', err.message);
        setFetched(false);
      })
  }, []);

  return (
    fetched && content.data
      ?
      <SlackApp content={content} />
      :
      <div style={{textAlign: 'center', paddingTop: '10%', fontSize: '35px'}}>Veri alırken hata oluştu.</div>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);