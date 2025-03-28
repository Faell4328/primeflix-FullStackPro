import { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../services/api';
import './filme-info.css';

export default function Filme(){
  
  const { id } = useParams();
  const navigation = useNavigate();
  const [filme, setFilme] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function loadFilme(){
      await api.get(`/movie/${id}`, {
        params:{
          api_key: '28fc232cc001c31e8a031f419d0a14ca',
          language: 'pt-BR',
          page: 1,
        }
      })

      .then((response)=>{
        setFilme(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch(()=>{
        console.log('Filme não encontrado');
        navigation('/', { replace: true });
        return;
      })
    }

    loadFilme();

    return() => {
      console.log('COMPONENTE FOI DESMONTADO');
    }
  }, [navigation, id]);

  function salvarFilme(){
    const minhaLista = localStorage.getItem('primeflix');

    let filmesSalvos = JSON.parse(minhaLista) || [];

    const hasFilme = filmesSalvos.some((filmes_salvo) => filmes_salvo.id == filme.id);

    if(hasFilme){
      toast.warn('Esse filme já está na lista');
      return;
    }
    else{
      filmesSalvos.push(filme);
      localStorage.setItem('primeflix', JSON.stringify(filmesSalvos));
      toast.success('Filme salvo com sucesso');
      return;
    }
  }

  if(loading){
    return(
      <div className='filme-info'>
        <h1>Carregando detalhes...</h1>
      </div>
    )
  }

  return(
    <div className='filme-info'>
      <h1>{filme.title}</h1>
      <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} />

      <h3>Sinopse</h3>
      <span>{filme.overview}</span>

      <strong>Avaliação: {filme.vote_average.toFixed(1)}/10</strong>

      <div className='area-buttons'>
        <button onClick={salvarFilme}>Salvar</button>
        <button>
          <a target='blank' rel='external' href={`https://www.youtube.com/results?search_query=${filme.title} Trailer`}>Treiler</a>
        </button>
      </div>

    </div>
  )
}
