import React from 'react';
import {css} from 'emotion';
import dateFns from 'date-fns';

export const ProfileInfo = ({name, time}) => (
  <div className={userInfo}>
    <span className={'userName'}>{name}</span>
    <span className={'time'}>{dateFns.format(new Date(time * 1000), 'HH:mm')}</span>
  </div>
);

const userInfo = css`
  margin-bottom: 10px;
  .userName{
    font-size: 1.2em; 
    font-family: 'Futura', sans-serif;  
  }
  .time{
    margin-left: 10px;
    font-size: 0.75em;
  }
`;