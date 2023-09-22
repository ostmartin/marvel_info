import { Link, useHistory } from "react-router-dom";

const ErrorGoBackButton = () => {
    const history = useHistory();
    
    if (history.length <= 2) {
        return (
            <button className="button button__main button__long">
                <div className="inner">
                    <Link to='/marvel_info'>
                        To main page
                    </Link>
                </div>
            </button>
        )
    }

    return (
        <button className="button button__main button__long">
            <div className="inner" onClick={() => history.goBack()}>Go Back</div>
        </button>
    )
}

export default ErrorGoBackButton;