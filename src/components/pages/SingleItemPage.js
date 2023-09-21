import { useParams, Link, useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';

import useMarvelService from '../../services/MarvelService';
import LoadingSpinner from '../spinner/LoadingSpinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import ErrorGoBackButton from "../errorGoBackButton/ErrorGobackButton";
import AppBanner from "../appBanner/AppBanner";

import './singleItemPage.scss';

const SingleItemPage = ({id, category}) => {
    const renderParam = useParams()[id];
    const [item, setItem] = useState(null);
    const {loading, error, getSingleMarvelData, clearError, findCharByName} = useMarvelService();
    
    useEffect(() => {
        updateItem();
    }, [renderParam]);

    const updateItem = () => {
        clearError();
        
        if (category === 'characters') {
            findCharByName(renderParam)
            .then(setItem);
        } else {
            getSingleMarvelData('comics', renderParam)
            .then(setItem);
        }
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const goBackBtn = error ? <ErrorGoBackButton/> : null
    const spinner = loading ? <LoadingSpinner/> : null;
    const content = !(loading || error || !item) ? (category === 'comics' ? <ViewComic item={item}/> : <ViewCharacter item={item}/>) : null;


    return (
        <>
            {errorMessage}
            {goBackBtn}
            {spinner}
            {content}
        </>
    )
}

const ViewComic = ({item}) => {
    const {title, description, pageCount, language, price, thumbnail} = item;

    return (
        <>
            <AppBanner/>
            <div className="single-item">
                <img src={thumbnail} alt={title} className="single-item__img"/>
                <div className="single-item__info">
                    <h2 className="single-item__name">{title}</h2>
                    <p className="single-item__descr">{description}</p>
                    <p className="single-item__descr">{pageCount}</p>
                    <p className="single-item__descr">Language: {language}</p>
                    <div className="single-item__price">{price}</div>
                </div>
                <Link to='/marvel_info/comics' className="single-item__back">Back to all</Link>
            </div>
        </>
    )
}

const ViewCharacter = ({item}) => {
    const {name, description, thumbnail} = item;

    return (
        <>
            <AppBanner/>
            <div className="single-item">
                <img src={thumbnail} alt={name} className="single-item__img"/>
                <div className="single-item__info">
                    <h2 className="single-item__name">{name}</h2>
                    <p className="single-item__descr">{description}</p>
                </div>
                <Link to='/marvel_info' className="single-item__back">Back to all</Link>
            </div>
        </>
    )
}

export default SingleItemPage;