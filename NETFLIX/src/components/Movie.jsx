import { useState } from "react";
import PropTypes from "prop-types";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

// Her bir film öğesini temsil eden Movie bileşeni
const Movie = ({ item }) => {
  // Beğeni durumunu ve kaydedildiği durumu takip etmek için state'ler
  const [like, setLike] = useState(false);
  const [saved, setSaved] = useState(false);

  // Kullanıcı bilgilerini almak için UserAuth hook'unu kullanma
  const { user } = UserAuth();

  // Firestore'da kullanıcının belirli bir filmi kaydetmek için kullanılacak belge referansı
  const movieID = doc(db, "users", `${user?.email}`);

  // Bir filmi kaydetme işlemi
  const saveShow = async () => {
    // Eğer kullanıcı giriş yapmışsa işlemi gerçekleştir, aksi takdirde uyarı ver
    if (user?.email) {
      // Beğeni durumunu tersine çevir ve kaydedildiği durumu güncelle
      setLike(!like);
      setSaved(true);

      // Firestore'da kullanıcının belgesini güncelle, savedShows dizisine yeni film eklenir
      await updateDoc(movieID, {
        savedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path,
        }),
      });
    } else {
      // Kullanıcı giriş yapmamışsa uyarı ver
      alert("Please log in to save a movie");
    }
  };

  // Movie bileşeni JSX yapısı
  return (
    <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2">
      {/* Film afişi */}
      <img
        className="w-full h-auto block"
        src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
        alt={item?.title}
      />
      {/* Film bilgileri gösterilecek overlay */}
      <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
        {/* Film başlığı */}
        <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
          {item?.title}
        </p>
        {/* Film beğeni ikonu, tıklanabilir */}
        <p onClick={saveShow}>
          {like ? (
            <FaHeart className="absolute top-4 left-4 text-gray-300" />
          ) : (
            <FaRegHeart className="absolute top-4 left-4 text-gray-300" />
          )}
        </p>
      </div>
    </div>
  );
};

// Movie bileşeni için beklenen prop tipleri belirlenir
Movie.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    backdrop_path: PropTypes.string,
  }).isRequired,
};

export default Movie;
