import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import LoadingSpinner from '../spinner/LoadingSpinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 215,
        charEnded: false
    };

    marvelService = new MarvelService();
    
    componentDidMount() {
        this.onRequest();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.offset !== prevState.offset) {
            window.addEventListener('scroll', this.onScrollRequest);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollRequest)
    }

    
    onScrollRequest = () => {
        if (((document.documentElement.clientHeight + window.scrollY) >= document.documentElement.scrollHeight)) {
            this.onRequest(this.state.offset)
        }
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
                            .then(this.onCharListLoaded)
                            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        this.setState(({charList, offset}) => {
            return {
                charList: [...charList, ...newCharList],
                loading: false,
                newItemsLoading: false,
                offset: offset + 9,
                charEnded: ended
            }
        })
    }

    // componentDidMount() {
    //     this.updateCharList();
    // }

    // updateCharList = () => {
    //     this.marvelService.getAllCharacters()
    //         .then(charList => {
    //             this.setState({
    //                     charList,
    //                     loading: false
    //                 })
    //         })
    //         .catch(this.onError);
    // }

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
                <li key={id} 
                    className="char__item"
                    onClick={() => this.props.onCharSelected(id)}>
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
        const {charList, loading, error, offset, newItemsLoading, charEnded} = this.state;

        const itemsList = this.renderItems(charList);

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
                        onClick={() => this.onRequest(offset)}>
                    <div className="inner">Load More</div>
                </button>
            </div>
        )
    }
}

export default CharList;