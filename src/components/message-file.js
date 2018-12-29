import React from "react";
import {css} from "emotion";
import {Reactions} from "./reactions";

export const MessageFile = ({file, reactions}) => {
  if (file.mimetype.includes('text')){
    if (!file.preview) return null;
    const previews  = file.preview.split('\n');
    return (
      <React.Fragment>
        <div className={textFileStyle} key={file.timestamp}>
          <span className="title">{file.title}</span>
          <div className="previewContainer">
            <div className="previewNumbers">{previews.map((p, index) => <p key={p+index}>{index+1}</p>)}</div>
            <div className="previewMessages">{previews.map((preview, i) => <span key={preview+i+1}>{preview}</span>)}</div>
          </div>
        </div>
        <Reactions reactions={reactions}/>
      </React.Fragment>
    );
  }
  if (file.mimetype.includes('image')){
    return (
      <React.Fragment>
        <div className={textImageStyle} key={file.timestamp} >
          <span className="title">{file.title}</span>
          <img className="image" src={file.thumb_720} />
        </div>
        <Reactions reactions={reactions}/>
      </React.Fragment>
    );
  }
  if (file.mimetype.includes('application')){
    let link;
    if (file.filetype.includes('xls')){
      link = "https://i0.wp.com/taxpress.gr/wp-content/uploads/2017/05/Excel-Icon.png?fit=215%2C236";
    } else if (file.filetype.includes('pdf')){
      link = `https://png.pngtree.com/svg/20170509/i_pdf_356308.png`;
    } else if (file.filetype.includes('docx')){
      link = 'https://banner2.kisspng.com/20180410/ike/kisspng-microsoft-word-doc-microsoft-office-2013-sas-5acc745685cf03.2378499615233485665481.jpg';
    } else {
      link = 'https://cdn.icon-icons.com/icons2/494/PNG/512/file-empty_icon-icons.com_48300.png';
    }
    return (
      <React.Fragment>
        <div key={file.timestamp} className={appFileStyle}>
          <img src={link} style={{width: '55px'}}/>
          <span>{file.name}</span>
        </div>
        <Reactions reactions={reactions}/>
      </React.Fragment>
    );
  }
  return null;
};

const appFileStyle = css`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 7px 0 10px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 5px;
  & > img {
    width: 55px;
  }
  & > span {
    font-size: 1em;
    font-weight: bold;
    margin-left: 8px;
  }
`;

const textImageStyle = css` 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 10px;
  .title{
    font-size: 0.7em;
    color: gray;
    padding: 8px 0 4px 0;
  }
  .image{
    max-width: 400px;
    max-height: 400px;
    border-radius: 5px; 
  }
`;

const textFileStyle = css` 
  position: relative; 
  margin-bottom: 10px; 
  .title{
    font-size: 0.8em;
    color: gray;
  }
  &::after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 0.8));
  }
  .previewContainer{
    display: flex;
    border-radius: 5px;
    border: 1px solid lightgray;
    margin-top: 5px;
    font-size: 0.8em;
    color: gray;
  }
  .previewNumbers{
    display: flex;
    width: 60px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(100, 100, 100, 0.2);
    border-radius: 5px 0 0 5px;
    padding: 0 10px 0 20px ;
  }
  .previewMessages{
    width: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0.4) 100%);
    border-radius: 0 5px 5px 0;
    padding: 5px 5px 5px 10px;
    & > span {
      width: 100%;
    }
  }
`;