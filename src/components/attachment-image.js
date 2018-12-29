import React from "react";
import dateFns from 'date-fns';
import localeTr from 'date-fns/locale/tr'

export const AttachmentImage = ({attachment}) => (
  <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
    {attachment.ts && <span style={{color: 'gray', margin: '10px 0 4px 0'}}>{dateFns.format(new Date(attachment.ts * 1000), 'MMM DD', {locale: localeTr})}</span>}
    <img src={attachment.image_url} style={{maxHeight: '200px', maxWidth: '200px', borderRadius: '5px', border: '1px solid lightgray'}} />
  </div>
);