import {Link} from 'react-router-dom';

import error404 from '../../resources/img/404.jpg';

const Page404 = () => {
    return (
        <div>
            <img src={error404} alt="error 404" />
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn`t exist</p>
            <Link to="/marvel_info" style={{display: 'block', width: '30%', margin: '30px auto', textAlign: 'center', 
            fontWeight: 'bold', fontSize: '24px', borderRadius: '10px', backgroundColor: '#9F0013'}}>Back to main page</Link>
        </div>
    )
}

export default Page404