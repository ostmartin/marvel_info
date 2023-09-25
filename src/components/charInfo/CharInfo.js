import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = ({charId}) =>{
    const [char, setChar] = useState(null);

    const {process, getSingleMarvelData, clearError, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [charId]);

    const updateChar = () => {
        if (!charId) {
            return;
        }
        clearError();
        
        getSingleMarvelData('characters', charId)
            .then(setChar)
            .then(() => setProcess('success'));
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    const {checkAvailableImage} = useMarvelService();
    const imageStyle = checkAvailableImage(thumbnail);
    const comicsList = comics.map((item, i) => {
        const urlParts = item.resourceURI.split('/');
        const id = urlParts[urlParts.length - 1];

        if (i > 9) {
            return;
        }
        return (
            <li key={i} className="char__comics-item">
                    <Link to={`/marvel_info/comics/${id}`}>{item.name}</Link>
            </li>
        )
    })

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imageStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsList.length === 0 ? 'Comics not found' : comicsList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;