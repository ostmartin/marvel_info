import LoadingSpinner from "../components/spinner/LoadingSpinner";
import Skeleton from "../components/skeleton/Skeleton";
import ErrorMessage from "../components/errorMessage/ErrorMessage";

const setContent = (process, Component, data) => {
    switch(process) {
        case 'waiting':
            return <Skeleton/>;
        case 'loading':
            return <LoadingSpinner/>;
        case 'success':
            return <Component data={data}/>
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

export default setContent;