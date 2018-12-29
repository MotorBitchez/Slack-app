import React from "react";
import {css} from "emotion";
import dateFns from 'date-fns';
import localeTr from 'date-fns/locale/tr';

export const Separator = ({date}) => {
  let today = new Date();
  let isToday = Math.abs(dateFns.differenceInCalendarDays(today, new Date(date * 1000))) < 1;
  return (
    <div className={separatorStyle}>
      <div/>
      <span>{isToday ? 'Bugün' : dateFns.format(new Date(date * 1000), 'dddd, MMMM DD', {locale: localeTr})}</span>
    </div>
  );
};

const separatorStyle = css`
  width: 100%; 
  display: flex;
  justify-content: center;
  align-items: center; 
  margin: 0 0 20px 0;
  div{
    height: 2px;
    flex-grow: 1; 
    background: linear-gradient(to right, green, red, orange, blue);
  }
  span{ 
    color: gray;
    font-weight: 500;
    background: linear-gradient(blue, black);
    padding-left: 5px;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;