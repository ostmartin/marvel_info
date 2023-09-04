import { useState, useEffect, useRef } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import LoadingSpinner from '../spinner/LoadingSpinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = ({onCharSelected}) => {
    const [initState, setInitState] = useState({
        charList: [],
        newItemsLoading: false,
        offset: 215,
        charEnded: false
    })

    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(215);
    const [charEnded, SetCharEnded] = useState(false);

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    // useEffect(() => {
    //     const onScrollRequest = () => {
    //         if ((document.documentElement.clientHeight + window.scrollY) === document.documentElement.scrollHeight) {
    //             onRequest(initState.offset)
    //         }
    //     }
        
    //     window.addEventListener('scroll', onScrollRequest);
        
    //     return () => {
    //         window.removeEventListener('scroll', onScrollRequest)
    //     };
    // }, [initState.offset])

    const {loading, error, getAllCharacters, checkAvailableImage} = useMarvelService();

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllCharacters(offset)
            .then(onCharListLoaded);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemsLoading(false);
        setOffset(offset => offset + 9);
        SetCharEnded(ended);
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
                <li key={id}
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

    const itemsList = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <LoadingSpinner/> : null;
    // const content = !(loading || error) ? itemsList : null;
    
    return (
        <div className="char__list">
                {itemsList}
                {spinner}
                {errorMessage}
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