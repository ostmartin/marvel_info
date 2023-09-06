import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=df45cf660f835fae11e3961d7b9575b8';
    const _baseOffset = 215;

    const {loading, request, error, clearError} = useHttp();

    const getMarvelData = async (data, limit, offset = _baseOffset) => {
        const res = await request(`${_apiBase}${data}?limit=${limit}&offset=${offset}&${_apiKey}`);
        
        if (data === 'characters') {
            return await res.data.results.map(_transformCharacter);
        }

        return await res.data.results.map(_transformComics);
    }

    const getSingleMarvelData = async (data, id) => {
        const res = await request(`${_apiBase}${data}/${id}?${_apiKey}`);
        
        if (data === 'characters') {
            return _transformCharacter(res.data.results[0]);
        }

        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        let description = char.description;

        if (description.length <= 0) {
            description = 'There is no information about this character';
        }

        if (description.length > 150) {
            description = description.slice(0, 150) + '...';
        }

        return {
            id: char.id,
            name: char.name,
            description: description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (item) => {
        return {
            id: item.id,
            title: item.title,
            description: item.description || "There is no description",
            pageCount: item.pageCount ? `${item.pageCount} p.` : "No information about the number of pages", 
            price: item.prices[0].price === 0 ? 'NOT AVAILABLE' : (item.prices[0].price + '$'),
            language: item.textObjects.language || "en-us",
            thumbnail: item.thumbnail.path + '.' + item.thumbnail.extension,
            url: item.urls[0].url
        }
    }

    const checkAvailableImage = (path) => {
        let imageStyle = {
            objectFit : 'fill'
        };

        if(/image_not_available/gi.test(path)) {
            imageStyle.objectFit = 'unset';
        }

        return imageStyle;
    }

    return {loading, error, getMarvelData, getSingleMarvelData, checkAvailableImage, clearError}
}

export default useMarvelService;