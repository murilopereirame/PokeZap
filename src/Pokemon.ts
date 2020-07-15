import axios from 'axios';
import fs from 'fs';
class Pokemon {
    private _nome: string = '';
    private _imgUrl: string = '';
    private _tipo: Array<string> = [];
    private _peso: number = 0;
    private _index: number = 0;

    constructor(index?: number, nome?: string) {
        if(index != undefined)
            this._index = index;
        
        if(nome != undefined)
            this._nome = nome;
    }

    public getNome(): string {
        return this._nome;
    }

    public getImg(): string {
        return this._imgUrl;
    }

    public getTipo(): Array<string> {
        return this._tipo;
    }

    public getPeso(): number {
        return this._peso;
    }

    public getIndex(): number {
        return this._index;
    }

    public async fetchData() {
        let endpoint = `https://pokeapi.co/api/v2/pokemon/${this._index != 0 ? this._index : this._nome.toLowerCase()}`;
        let pokeResponse = null;

        try {
            pokeResponse = await axios.get(endpoint);
            
            for(let i = 0; i < pokeResponse.data['types'].length; i++) {
                this._tipo.push(pokeResponse.data['types'][i]['type']['name']);
            }

            let imgUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeResponse.data['id'].toString().padStart(3, '0')}.png`            
            this._nome = pokeResponse.data['name'];
            this._index = pokeResponse.data['id'];
            this._peso = pokeResponse.data['weight'];            
            this._imgUrl = imgUrl;                
        } catch(UnhandledPromiseRejectionWarning) {
            pokeResponse = undefined;
            this._index = -1;
        }
    }

    public getInfo(): string {
        let info = ''+
        `*Pokémon:* ${this._nome[0].toUpperCase() + this._nome.slice(1)}\n` +
        `*Pokédex:* ${this._index}\n` +
        `*Tipo(s):* ${this._tipo.join(', ')}\n` +
        `*Peso:* ${this._peso}lbs`;
        
        return info;
    }

    private async downloadImage (url: string, path: string) {  
        const writer = fs.createWriteStream(path)
        
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
        
        response.data.pipe(writer)
        
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    }
}

export default Pokemon;