import React from 'react';
import emojione from 'emojione';
import {css} from 'emotion';

export const Reactions =  ({reactions}) => (
  reactions ?
  <div className={reactionContainer}>
    {reactions.map(reaction => {
      const html = `${emojione.shortnameToImage(':'+reaction.name+':')}<span>${reaction.count}</span>`;
      if (!html.includes('<img')) return null;
      return <div className={reactionStyle} dangerouslySetInnerHTML={{__html: html}} key={reaction.name}/>
    })}
  </div> : null
);

const reactionContainer = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const reactionStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 40px;
  height: 25px;
  border: 1px solid gray;
  background: white;
  margin: 0 5px 5px 0;
  border-radius: 5px;
  img {
    width: 15px;
    height: 15px;
  }
  span{
    font-size: 0.7em;
    color: #0576b9;
    font-weight: bold;
    padding-right: 3px;
  }
`;