import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import useMarvelService from '../../services/MarvelService';
import { Formik, Form, Field, ErrorMessage, useField} from "formik";
import * as Yup from 'yup';

import './findCharByName.scss';

const FindCharByName = () => {
    const [char, setChar] = useState(null);
    const [newLoading, setNewLoading] = useState(false);
    const {findCharByName, loading, error, clearError} = useMarvelService();
    
    const charOnLoad = (name) => {
        clearError();
        setNewLoading(true);
        setChar(char => null)

        findCharByName(name)
            .then(data => setChar(char => data))
            .catch(error => setChar(null));

    }

    let loaded;

    if (!error & !newLoading & !loading) {
        loaded = null;
    } else {
        loaded = <View char={char} loading={loading} error={error} />
    }

    return (
        <Formik
            initialValues={{
                name: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string().min(3, 'At least 3 symbols...').required('This field is required')
            })}
            onSubmit={values => charOnLoad(values.name)}
            >
            <Form>
                <div className='find__box'>
                    <div className='find__title'>
                        Or find a character by name:
                    </div>
                    <div className='find__inner-container'>
                        <Field
                            name='name'
                            placeholder='Enter name'
                            className='find__input'
                        />
                        <button type='submit' className='button button__main'>
                            <div className='inner'>Find</div>
                        </button>
                        <ErrorMessage name='name' component='div' className='find__error'/>
                        {loaded}
                    </div>
                </div>
            </Form>
        </Formik>
    )
}

const View = ({char, loading, error}) => {
    const text = char !== null & !loading ? `There is! Visit ${char.name} page?` : (!error ? null : 'The character was not found. Check the name and try again');
    const classes = char !== null ? 'find__succes' : 'find__error'
    
    if (char === null) {
        return (
            <>
                <div className={classes}>{text}</div>
            </>
        )
    }

    return (
        <>
            <div className={classes}>{text}</div>
            <ToPageButton name={char.name}/>
        </>
    )
}

const ToPageButton = ({name}) => {
    return (
        <Link to={`/marvel_info/characters/${name}`} 
            className='button button__secondary'>
                    <div className='inner'>To page</div>
        </Link>
    )
}

export default FindCharByName;