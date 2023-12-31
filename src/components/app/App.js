import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';
import LoadingSpinner from '../spinner/LoadingSpinner';


const Page404 = lazy(() => import('../pages/page-404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleItemPage = lazy(() => import('../pages/SingleItemPage'));

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<LoadingSpinner/>}>
                        <Switch>
                            <Route exact path="/marvel_info">
                                <MainPage/>
                            </Route>
                            <Route exact path="/marvel_info/comics">
                                <ComicsPage/>
                            </Route>
                            <Route exact path="/marvel_info/comics/:comicId">
                                <SingleItemPage id={"comicId"} category={'comic'}/>
                            </Route>
                            <Route exact path="/marvel_info/characters/:charName">
                                <SingleItemPage id={"charName"} category={'characters'}/>
                            </Route>
                            <Route path="*">
                                <Page404/>
                            </Route>
                        </Switch>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;