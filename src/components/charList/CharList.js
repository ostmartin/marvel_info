import { useState, useEffect, useRef, useTransition } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Transition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import LoadingSpinner from '../spinner/LoadingSpinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const duration = 500;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0 },
  exited:  { opacity: 0 },
};

const CharList = ({onCharSelected}) => {
    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(215);
    const [charEnded, setCharEnded] = useState(false);

    useEffect(() => {
        onRequest(offset, true);
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

    const {loading, error, getMarvelData, checkAvailableImage} = useMarvelService();

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getMarvelData('characters', 9, offset)
            .then(onCharListLoaded);
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
                <Transition key={id}
                            timeout={duration}
                            mountOnEnter>
                    {
                        state => (
                            <li ref={el => itemsRef.current[i] = el}
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
                                style={{
                                    ...defaultStyle,
                                    ...transitionStyles[state]
                                }}
                                >
                                <img src={thumbnail} alt={name} style={imageStyle}/>
                                <div className="char__name">{name}</div>
                            </li>
                        )
                    }
                </Transition>
            )
        })

        return (
            
                <ul className="char__grid">
                    <TransitionGroup component={null}>
                        {items}
                    </TransitionGroup>
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