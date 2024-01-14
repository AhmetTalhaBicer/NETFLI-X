import axios from "axios";
import { useEffect, useState } from "react";
import Movie from "./Movie";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import PropTypes from "prop-types";

// Row bileşeni, bir film kategorisinin altındaki bir sırayı temsil eder.
const Row = ({ title, fetchURL, rowID }) => {
  // State hook'u kullanarak filmleri tutan bir state tanımlıyoruz.
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(fetchURL).then((response) => {
      // Gelen veriyi state içindeki movies'e atıyoruz.
      setMovies(response.data.results);
    });
  }, [fetchURL]); // useEffect, sadece fetchURL değiştiğinde tekrar çalışır.

  // Sol ve sağ okları kullanarak slaytı kaydırma işlevlerini tanımlıyoruz.
  const slideLeft = () => {
    // slider elementini belirliyoruz ve 500 birim sola kaydırıyoruz.
    var slider = document.getElementById("slider" + rowID);
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    // slider elementini belirliyoruz ve 500 birim sağa kaydırıyoruz.
    var slider = document.getElementById("slider" + rowID);
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  return (
    <>
      {/* Film kategorisinin adını gösteren bir başlık */}
      <h2 className="text-white font-bold md:text-xl p-4">{title}</h2>
      {/* Film afişlerini gösteren bir slider */}
      <div className="relative flex items-center group">
        {/* Sol ok, sol tarafa kaydırmak için tıklandığında slideLeft fonksiyonunu çağırır */}
        <MdChevronLeft
          onClick={slideLeft}
          className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
        {/* Film afişlerini içeren slider */}
        <div
          id={"slider" + rowID}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
        >
          {/* Her bir filmi Movie bileşeni ile gösterir */}
          {movies.map((item, id) => (
            <Movie key={id} item={item} />
          ))}
        </div>
        {/* Sağ ok, sağ tarafa kaydırmak için tıklandığında slideRight fonksiyonunu çağırır */}
        <MdChevronRight
          onClick={slideRight}
          className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
          size={40}
        />
      </div>
    </>
  );
};

// Prop tiplerini kontrol etmek için propTypes nesnesini tanımlıyoruz.
Row.propTypes = {
  title: PropTypes.string.isRequired, // title prop'unun string tipinde ve zorunlu olduğunu belirtiyoruz.
  fetchURL: PropTypes.string.isRequired, // fetchURL prop'unun string tipinde ve zorunlu olduğunu belirtiyoruz.
  rowID: PropTypes.number.isRequired, // rowID prop'unun number tipinde ve zorunlu olduğunu belirtiyoruz.
};

// Row bileşenini dışa aktarıyoruz.
export default Row;
