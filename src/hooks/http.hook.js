import { useState, useCallback } from "react";

export const useHttp = () => {
    const [loading, setloading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type' : 'application/json'}) => {

        setloading(true);

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.state}`);
            }
            const data = await response.json();

            setloading(false);
            
            if (data.data.results.length === 0) {
                throw new Error(`No matches found`);
            }

            return data;
        } catch (error) {
            setloading(false);
            setError(error.message);

            throw error;
        }

    }, [])

    const clearError = useCallback(() => {
        setError(null);
    }, [])

    return {loading, error, request, clearError};
}