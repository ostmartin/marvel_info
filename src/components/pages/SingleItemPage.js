import { useParams, Link, useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";

import useMarvelService from '../../services/MarvelService';
import LoadingSpinner from '../spinner/LoadingSpinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import ErrorGoBackButton from "../errorGoBackButton/ErrorGobackButton";
import AppBanner from "../appBanner/AppBanner";

import './singleItemPage.scss';

const setContent = (process, Component, data) => {
    switch(process) {
        case 'waiting':
            return;
        case 'loading':
            return <LoadingSpinner/>;
        case 'success':
            return <Component data={data}/>
        case 'error':
            return (
                <>
                    <ErrorMessage/>
                    <ErrorGoBackButton/>
                </>
            );
        default:
            throw new Error('Unexpected process state');
    }
}

const SingleItemPage = ({id, category}) => {
    const renderParam = useParams()[id];
    const [item, setItem] = useState(null);
    const {process, setProcess, getSingleMarvelData, clearError, findCharByName} = useMarvelService();
    
    useEffect(() => {
        updateItem();
    }, [renderParam]);

    const updateItem = () => {
        clearError();
        
        if (category === 'characters') {
            findCharByName(renderParam)
            .then(setItem)
            .then(() => setProcess('success'));
        } else {
            getSingleMarvelData('comics', renderParam)
            .then(setItem)
            .then(() => setProcess('success'));
        }
    }

    return (
        <>
            {category === 'comic' ? 
                setContent(process, ViewComic, item) : setContent(process, ViewCharacter, item)
            }
        </>
    )
}

const ViewComic = ({data}) => {
    const {title, description, pageCount, language, price, thumbnail} = data;

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content={`Page of ${title}`}
                />
                <title>{title}</title>
            </Helmet>
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

const ViewCharacter = ({data}) => {
    const {name, description, thumbnail} = data;

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content={`Page of ${name}`}
                />
                <title>{name}</title>
            </Helmet>
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