import { useState, useEffect, useRef, useMemo } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import LoadingSpinner from '../spinner/LoadingSpinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, newLoading) => {
    switch(process) {
        case 'waiting':
            return <LoadingSpinner/>;
        case 'loading':
            return newLoading ? <Component/> : <LoadingSpinner/>;
        case 'success':
            return <Component/>
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = ({onCharSelected}) => {
    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(215);
    const [charEnded, setCharEnded] = useState(false);

    const {process, setProcess, getMarvelData, checkAvailableImage} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     const onScrollRequest = () => {
    //         if((document.documentElement.clientHeight + window.scrollY) >= document.documentElement.scrollHeight - 1 && !newItemsLoading) {
    //             onRequest(offset, false);
    //         }
    //     }
    //     console.log('load')
        
    //     window.addEventListener('scroll', onScrollRequest);
        
    //     return () => {
    //         window.removeEventListener('scroll', onScrollRequest)
    //     };
    // }, [newItemsLoading, offset])

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getMarvelData('characters', 9, offset)
            .then(onCharListLoaded)
            .then(() => setProcess('success'));
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setOffset(offset => offset + 9);
        setNewItemsLoading(false);
        setCharEnded(ended);
    }

    const itemsRef = useRef([]);

    const focusOnItem = (id) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef.current[id].classList.add('char__item_selected');
        itemsRef.current[id].focus()
    }

    const renderItems = (arr) => {
        const items = arr.map((char, i) => {
            const {name, thumbnail, id} = char;
            
            const imageStyle = checkAvailableImage(thumbnail);

            return (
                <li key={i}
                    ref={el => itemsRef.current[i] = el}
                    tabIndex={0}
                    className="char__item"
                    onClick={() => {
                            onCharSelected(id);
                            focusOnItem(i)
                        }}
                    // onFocus={() => {
                    //     onCharSelected(id);
                    // }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            onCharSelected(id);
                            focusOnItem(i);
                        }
                    }}
                    >
                    <img src={thumbnail} alt={name} style={imageStyle}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
                <ul className="char__grid">
                        {items}
                </ul>
        )
    }

    const elems = useMemo(() => setContent(process, () => renderItems(charList), newItemsLoading), [charList])
    
    return (
        <div className="char__list">
                {elems}
            <button className="button button__main button__long"
                    disabled={newItemsLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset, false)}>
                <div className="inner">Load More</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;