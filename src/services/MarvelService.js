export default class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=df45cf660f835fae11e3961d7b9575b8';
    _baseOffset = 215;

    getResource = async(url) => {
            let res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Could not fetch ${url}, status: ${res.state}`);
            }
            
            return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return await res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
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

    checkAvailableImage = (path) => {
        let imageStyle = {
            objectFit : 'fill'
        };

        if(/image_not_available/gi.test(path)) {
            imageStyle.objectFit = 'unset';
        }

        return imageStyle;
    }
}