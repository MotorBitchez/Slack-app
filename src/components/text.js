import React from 'react';
import {Reactions} from "./reactions";

export const Text = ({text, reactions}) => (
  <React.Fragment>
    <div style={{marginBottom: 5}}>{text}</div>
    <Reactions reactions={reactions}/>
  </React.Fragment>
);