import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import LoadingSpinner from "../spinner/LoadingSpinner";
import AppBanner from "../appBanner/AppBanner";

import './comicsList.scss';

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

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {process, setProcess, getMarvelData} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getMarvelData('comics', 8, offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('success'));
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setOffset(offset => offset + 8);
        setNewItemsLoading(false);
        setComicsEnded(ended);
    }

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
            const {title, price, thumbnail, id} = item;

            return (
                <li key={i} className="comics__item">
                    <Link to={`/marvel_info/comics/${id}`}>
                        <img src={thumbnail} alt={title} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                    {items}
                </ul>
        )
    }

    return (
        <>
            <AppBanner/>
            <div className="comics__list">
                    {setContent(process, () => renderItems(comicsList), newItemsLoading)}
                <button className="button button__main button__long"
                        disabled={newItemsLoading}
                        style={{'display': comicsEnded ? 'none' : 'block'}}
                        onClick={() => onRequest(offset, false)}>
                    <div className="inner">Load More</div>
                </button>
            </div>
        </>
    )
}

export default ComicsList;