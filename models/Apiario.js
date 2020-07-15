class Apiario{
    
    constructor(nome, especie, populacao, apicultor, latitude, longitude){
        this._nome = nome;
        this._especie = especie;
        this._populacao = populacao;
        this._apicultor = apicultor;
        this._latitude = latitude;
        this._longitude = longitude;
    } 
   
    get nome(){
        return this._nome;
    }

    get especie(){
        return this._especie;
    }

    get populacao(){
        return this._populacao;
    }

    get apicultor(){
        return this._apicultor;
    }

    get latitude(){
        return this._latitude;
    }

    get longitude(){
        return this._longitude;
    }
}