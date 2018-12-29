import React from "react";
import {css} from 'react-emotion';

export const AttachmentAuthor = ({attachment}) => (
  <div className={style}>
    {attachment.service_icon && <img src={attachment.service_icon}/>}
    <span>{attachment.service_name}</span>
  </div>
);

const style = css` 
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 22px;
  padding: 0 0 6px 2px;
  & > img{
    height: 100%;
    width: auto;
    border-radius: 5px;
    margin-right: 8px;
  }
  & > span{
    color: rgb(90, 90, 90);
  }
`;