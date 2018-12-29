import React from 'react';
import {css} from 'emotion';

export const AttachmentActions = ({attachment}) => {
  return (
    <div className={attachmentActionStyle}>
      {attachment.actions.map(action => {
        let colorStyle = {borderColor: 'gray', color: 'black'};
        switch (action.style) {
          case 'danger':
            colorStyle = {borderColor: 'red', color: 'red'};
            break;
          case 'primary':
            colorStyle = {borderColor: '#008952', color: '#008952'};
            break;
        }
        switch (action.type) {
          case 'button':
            return <button className={'action-button'} style={colorStyle} key={action.text + action.url + action.type}>{action.text}</button>
          case 'select':
            return (
              <select className={'action-select'} key={`${action.text}${action.url}${action.type}`}>
                <option>{action.text || 'Choose an option...'}</option>
              </select>
            );
        }
        return null;
      })}
    </div>
  );
};

const attachmentActionStyle = css` 
  padding: 5px 5px 5px 0;
  .action-button{
    height: 30px;
    background: white;
    border: 1px solid;
    border-radius: 4px; 
    font-weight: bold; 
    margin: 5px 10px 5px 0;
  }
  .action-select{
    margin: 5px 10px 5px 0;
    width: 200px;
    height: 30px;
    background: white;
    border: 1px solid;
    border-radius: 4px; 
    color: rgb(90, 90, 90); 
  }
`;