import { useState, useCallback } from "react";

export const useHttp = () => {
    const [process, setProcess] = useState('waiting');

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type' : 'application/json'}) => {
        setProcess('loading');

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.state}`);
            }
            const data = await response.json();
            
            if (data.data.results.length === 0) {
                setProcess('error');
                throw new Error(`No matches found`);
            }

            return data;
        } catch (error) {
            setProcess('error');

            throw error;
        }

    }, [])

    const clearError = useCallback(() => {
        setProcess('loading');
    }, [])

    return {process, request, clearError, setProcess};
}