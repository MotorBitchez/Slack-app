import {css} from "emotion";
import React from "react";

export const AttachmentFields = ({attachment}) => {
  return (
    <div style={{padding: '5px 0'}}>
      {attachment.fields.map(field => (
        <div className={attachmentFieldStyle(!!field.short)} key={`${field.title}${field.value}`}>
          <p><strong>{field.title}</strong></p>
          <p>{field.value}</p>
        </div>
      ))}
    </div>
  );
};

const attachmentFieldStyle = (isShort) => css`
  padding: 5px 0;
  display: ${isShort ? 'inline-block' : 'block'};
  margin-right: ${isShort ? '35px' : '0'};
`;