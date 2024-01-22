import axios from "axios";
import { useEffect, useState } from "react";
import requests from "../services/MovieAPI";

const Main = () => {
  // movies state'i, API'den gelen popüler film verilerini içerir.
  const [movies, setMovies] = useState([]);

  // movies dizisinden rastgele seçilen bir film.
  const movie = movies[Math.floor(Math.random() * movies.length)];

  // Bileşen ilk kez render edildiğinde API'den popüler film verilerini çeker.
  useEffect(() => {
    axios.get(requests.requestPopular).then((response) => {
      // API'den gelen veriler movies state'ine set edilir.
      setMovies(response.data.results);
    });
  }, []);

  // truncateString fonksiyonu, bir metni belirli bir uzunluğa kadar kırpıp "..." ekler.
  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  // Bileşen render edildiğinde, seçilen rastgele filmi ve bilgileri gösterir.
  return (
    <div className="w-full h-[600px] text-white">
      <div className="w-full h-full">
        {/* Film afişi ve karanlık bir gradyan eklenmiş arka plan. */}
        <div className="absolute w-full h-[600px] bg-gradient-to-r from-black"></div>
        <img
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
          alt={movie?.title}
        />
        {/* Film başlığı, butonlar ve film bilgileri içeren overlay. */}
        <div className="absolute w-full top-[20%] p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold">{movie?.title}</h1>
          <div className="my-4">
            {/* "Play" ve "Watch Later" butonları. */}
            <button className="border bg-gray-300 text-black border-gray-300 py-2 px-5">
              Play
            </button>
            <button className="border text-white border-gray-300 py-2 px-5 ml-4">
              Watch Later
            </button>
          </div>
          {/* Film yayınlanma tarihi ve özet bilgisi. */}
          <p className="text-gray-400 text-sm">
            Released: {movie?.release_date}
          </p>
          <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
            {truncateString(movie?.overview, 150)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
