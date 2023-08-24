import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import LoadingSpinner from '../spinner/LoadingSpinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    };

    marvelService = new MarvelService();
    
    // componentDidMount() {
    //     this.marvelService.getAllCharacters()
    //         .then(data => {
    //             console.log(data);
    //             this.onCharListLoaded(data);
    //         })
    //         .catch(this.onError)
    // }

    // onCharListLoaded = (charList) => {
    //     this.setState({
    //         charList,
    //         loading: false
    //     })
    // }

    componentDidMount() {
        this.updateCharList();
    }

    updateCharList = () => {
        this.marvelService.getAllCharacters()
            .then(charList => {
                this.setState({
                        charList,
                        loading: false
                    })
            })
            .catch(this.onError);
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderItems = (arr) => {
        const items = arr.map(char => {
            const {name, thumbnail, id} = char;
            
            const imageStyle = this.marvelService.checkAvailableImage(thumbnail);

            return (
                <li key={id} className="char__item">
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

    render() {
        const {charList, loading, error} = this.state;

        const itemsList = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <LoadingSpinner/> : null;
        const content = !(loading || error) ? itemsList : null;
        
        return (
            <div className="char__list">
                    {content}
                    {spinner}
                    {errorMessage}
                <button className="button button__main button__long">
                    <div className="inner">Load More</div>
                </button>
            </div>
        )
    }
}

export default CharList;