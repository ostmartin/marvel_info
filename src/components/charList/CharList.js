import { useState, useEffect, useRef } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import LoadingSpinner from '../spinner/LoadingSpinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = ({onCharSelected}) => {
    const [initState, setInitState] = useState({
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 215,
        charEnded: false
    })

    useEffect(() => {
        onRequest();
    }, []);

    // useEffect(() => {
    //     onRequest();
    //     const onScrollRequest = () => {
    //         if ((document.documentElement.clientHeight + window.scrollY) >= document.documentElement.scrollHeight - 1) {
    //             onRequest(initState.offset)
    //         }
    //     }
        
    //     window.addEventListener('scroll', onScrollRequest);
        
    //     return () => {
    //         window.removeEventListener('scroll', onScrollRequest)
    //     };
    // }, [initState.offset])

    const marvelService = new MarvelService();

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
                            .then(onCharListLoaded)
                            .catch(onError);
    }

    const onCharListLoading = () => {
        setInitState({
            ...initState,
            newItemsLoading: true
        })
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        
        setInitState(initState => ({
            ...initState,
            charList: [...initState.charList, ...newCharList],
            loading: false,
            newItemsLoading: false,
            offset: initState.offset + 9,
            charEnded: ended
        }))
    }

    const onError = () => {
        this.setState({
            loading: false,
            error: true
        })

        setInitState({
            ...initState,
            loading: false,
            error: true
        })
    }

    const itemsRef = useRef([]);

    const focusOnItem = (id) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef[id].current.classList.add('char__item_selected');
        itemsRef[id].current.focus()
    }

    const renderItems = (arr) => {
        const items = arr.map((char, i) => {
            const {name, thumbnail, id} = char;
            
            const imageStyle = marvelService.checkAvailableImage(thumbnail);

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

    const {charList, loading, error, offset, newItemsLoading, charEnded} = initState;

    const itemsList = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <LoadingSpinner/> : null;
    const content = !(loading || error) ? itemsList : null;
    
    return (
        <div className="char__list">
                {content}
                {spinner}
                {errorMessage}
            <button className="button button__main button__long"
                    disabled={newItemsLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">Load More</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;