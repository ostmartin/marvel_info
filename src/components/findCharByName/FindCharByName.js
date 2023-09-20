import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import './findCharByName.scss';

const FindCharByName = () => {
    return (
        <div className='find__box'>
            <div className='find__title'>
                Or find a character by name:
            </div>
            <div className='find__inner-container'>
                    <input type="text" className='find__input' placeholder='Enter name' />
                    <a href="#" className='button button__main'>
                        <div className='inner'>Find</div>
                    </a>
                    <div className='find__succes'>There is! Visit name page?</div>
                    <a href="#" className='button button__secondary'>
                        <div className='inner'>To page</div>
                    </a>
            </div>
        </div>
    )
}

export default FindCharByName;