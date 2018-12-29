import React from "react";
import {css} from 'react-emotion';
import dateFns from 'date-fns';
import localeTr from 'date-fns/locale/tr';

export const AttachmentFooter = ({attachment}) => (
  <div className={footerStyle}>
    {attachment.footer_icon && <img src={attachment.footer_icon} />}
    <span className={'footer'}>{attachment.footer}</span>
    {attachment.ts && <span className={'date'}>{dateFns.format(new Date(attachment.ts * 1000), 'DD MMM YYYY HH:mm', {locale: localeTr})}</span>}
  </div>
);

const footerStyle = css`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 6px;
  font-size: 0.9em;
  & > img {
    height: 100%;
    width: auto;
    padding-right: 7px;
  }
  & > .footer {
    color: gray;
  }
  & > .date {
    padding: 0 5px;
    color: gray;
  }
`;