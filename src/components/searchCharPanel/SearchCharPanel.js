import { useState } from 'react';
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage as FormikError} from "formik";
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';

import './searchCharPanel.scss';

const setContent = (process, Component, data) => {
    switch(process) {
        case 'waiting':
            return null;
        case 'loading':
            return null;
        case 'success':
            return <Component data={data} process={process}/>
        case 'error':
            return <Component data={data} process={process}/>;
        default:
            throw new Error('Unexpected process state');
    }
}

const FindCharByName = () => {
    const [char, setChar] = useState(null);
    const {findCharByName, clearError, process, setProcess} = useMarvelService();
    
    const charOnLoad = (name) => {
        clearError();
        setChar(char => null)

        findCharByName(name)
            .then(data => setChar(char => data))
            .then(() => setProcess('success'));

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
                        <button type='submit' className='button button__main'disabled={process === 'loading'}>
                            <div className='inner'>Find</div>
                        </button>
                        <FormikError name='name' component='div' className='find__error'/>
                        {setContent(process, View, char)}
                    </div>
                </div>
            </Form>
        </Formik>
    )
}

const View = ({data, process}) => {    
    if (!data || process === 'error') {
        return (
            <>
                <div className='find__error'>The character was not found. Check the name and try again</div>
            </>
        )
    } else {
        return (
            <>
                <div className='find__succes'>{`There is! Visit ${data.name} page?`}</div>
                <ToPageButton name={data.name}/>
            </>
        )
    }
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