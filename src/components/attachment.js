import {prepareText} from "./elements";
import React from "react";
import {css} from "emotion";
import {AttachmentAuthor} from "./attachment-author";
import {AttachmentFields} from "./attachment-fields";
import {AttachmentImage} from "./attachment-image";
import {AttachmentFooter} from "./attachment-footer";
import {AttachmentActions} from "./attachment-actions";
import {AttachmentThumb} from "./attachment-thumb";
import {Reactions} from "./reactions";

export const Attachment = ({attachment, reactions, users, bots}) => {
  let color = 'rgba(0, 0, 0, 0.2)';
  if (attachment.color) {
    switch (attachment.color) {
      case 'good':
        color = 'limegreen';
        break;
      case 'warning':
        color = 'orange';
        break;
      case 'red':
        color = 'red';
        break;
      default:
        color = `#${attachment.color}`;
        break;
    }
  }

  return (
    <div className={attachmentStyle(attachment, color)}>
      {attachment.pretext && <div className={'pretext'}>{prepareText(attachment.pretext, users, bots)}</div>}
      <div className={'thumb'}>
        <div>
          {attachment.service_icon && <AttachmentAuthor attachment={attachment} />}
          {attachment.title && <div className={attachment.title_link ? 'title_link' : 'title'}>{attachment.title}</div>}
          {attachment.text && <div className={'text'}>{prepareText(attachment.text, users, bots)}</div>}
          {attachment.fields &&  <AttachmentFields attachment={attachment} />}
          {attachment.image_url && <AttachmentImage attachment={attachment} /> }
          {(attachment.footer || attachment.footer_icon) && <AttachmentFooter attachment={attachment} /> }
          {attachment.actions && <AttachmentActions attachment={attachment} /> }
        </div>
        {attachment.thumb_url && <AttachmentThumb attachment={attachment} />}
      </div>
    </div>
  );
};

const attachmentStyle = (attachment, color) => css`
  margin-bottom: 5px;
  & > .thumb {
    display: grid;
    grid-template-columns: ${attachment.thumb_url ? 'auto 75px' : 'auto'};
    & > div:first-child {
      border-left: 4px solid ${color};
      margin-top: 10px;
      padding: 0 10px;
    }
  }
  .title_link{
    font-weight: bold;
    color: dodgerblue;
    padding-bottom: 5px;
  }
  .title{
    font-weight: bold;
    padding: 2px 0;
  }
  .text{
    line-height: 25px;
  }
`;