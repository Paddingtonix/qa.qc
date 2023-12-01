import React, { useState } from 'react';
import "../../index.scss"

export const Butt =({OnClick, name}) => {
    return (
        <button className='button' onClick={OnClick}>{name}</button>
    )
}


