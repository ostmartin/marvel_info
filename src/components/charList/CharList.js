import { Component } from 'react';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: []
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateCharList();
    }

    updateCharList = () => {
        this.marvelService.getAllCharacters()
            .then(data => {
                this.setState({
                        charList: [...data]
                    })
            });
    }

    render() {
        return (
            <div className="char__list">
                <ul className="char__grid">
                    {this.state.charList.map(char => {
                        const {name, thumbnail, id} = char;
                        
                        const imageStyle = this.marvelService.checkAvailableImage(thumbnail);

                        return (
                            <li key={id} className="char__item">
                                <img src={thumbnail} alt={name} style={imageStyle}/>
                                <div className="char__name">{name}</div>
                            </li>  
                        )
                    })}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;