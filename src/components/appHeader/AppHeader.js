import './appHeader.scss';

const AppHeader = ({onPageSelected}) => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <a href="#">
                    <span>Marvel</span> information portal
                </a>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li onClick={() => onPageSelected('chars')}><a href="#">Characters</a></li>
                    /
                    <li onClick={() => onPageSelected('comics')}><a href="#">Comics</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;