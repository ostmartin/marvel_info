import { useState } from "react";

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

import decoration from '../../resources/img/vision.png';

const Characters = ({onCharSelected, charId}) => {
    return (
        <>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected}/>
                </ErrorBoundary>
                <ErrorBoundary>
                    <CharInfo charId={charId}/>
                </ErrorBoundary>
            </div>
        </>
    )
}

const App = () => {
    const [selectedChar, setSelectedChar] = useState(null);
    // const [page, setPage] = useState('chars');

    const onCharSelected = (id) => {
        setSelectedChar(id)
    }

    // const onPageSelected = (title) => {
    //     setPage(title)
    // }

    return (
        <div className="app">
            <AppHeader/>
            <main>
                <AppBanner/>
                <img className="bg-decoration" src={decoration} alt="vision"/>
                <ErrorBoundary>
                    <Characters onCharSelected={onCharSelected} charId={selectedChar}/>
                    {/* <ComicsList/> */}
                </ErrorBoundary>
            </main>
        </div>
    )
}

export default App;