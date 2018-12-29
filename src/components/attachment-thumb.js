import React from "react";
import {css} from 'react-emotion';

export const AttachmentThumb = ({attachment}) => {
  if (!attachment.thumb_url) return null;
  return <img className={style} src={attachment.thumb_url}/>;
};

const style = css`
  width: 75px;
  height: 75px;
  object-fit: cover;
`;