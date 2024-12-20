import React, { useState, useEffect } from 'react';
import './SearchScreen.css';
import axios from 'axios';
import { useSearchParams, Link } from'react-router-dom';
import Card from '../Card/Card';
import { TokenJWT } from '../Data/TokenJWT';
import ambiente from './../ambiente.js';

function SearchScreen() {
    const [artigos, setArtigos] = useState([]);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('query');

    const token = TokenJWT();

    useEffect(() => {
        fetchArtigos(searchTerm);
    }, [searchTerm]);

    const fetchArtigos = async (searchTerm) => {
        try {
            const response = await axios.get(`${ambiente.localHost}/artigo/search/${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const artigosComImagens = await Promise.all(response.data.map(async (artigo) => {
                    console.log(artigo)
                    return await fetchArtigoCompleto(artigo);
                }));
                setArtigos(artigosComImagens);
            }
        } catch (error) {
            console.error('Erro ao buscar artigos:', error);
        }
    };

    const fetchArtigoCompleto = async (artigo) => {
        try {
            const resImagem = await axios.get(`${ambiente.localHost}/conteudo/id/${artigo.imagem.conteudoID}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
            });
            const urlImagem = URL.createObjectURL(resImagem.data);
            return {
                ...artigo,
                imagemURL: urlImagem
            };
        } catch (error) {
            console.error('Erro ao buscar imagem do artigo:', error);
            return {
                ...artigo,
                imagemURL: ''
            };
        }
    };

    return (
        <div className="search-screen">
            <h2>Resultado da sua pesquisa</h2>

            <h2>{searchTerm}</h2>
            <div className='line'></div>

            
            <div className="scroll-container">
                {artigos.map((artigo, index) => (
                    <Link key={index} to={`/view/${artigo.artigoID}`}>
                        <Card
                            title={artigo.titulo}
                            description={artigo.descricao}
                            category={artigo.categoria.nome}
                            image={artigo.imagemURL}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SearchScreen;