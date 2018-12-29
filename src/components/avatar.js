import React from 'react';
import {css} from 'emotion';

export const Avatar = ({profile}) => {
  let src = profile.icons
    ? profile.icons.image_72 || profile.icons.image_48 || profile.icons.image_36 || ''
    : profile.profile.image_72 || profile.profile.image_48 || profile.profile.image_36 || profile.profile.image_original || '';
  return (
    <img src={src} className={avatarStyle}/>
  );
};

const avatarStyle = css`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  object-fit: cover;
`;