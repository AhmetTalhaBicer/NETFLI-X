import { useState } from "react";
import PropTypes from "prop-types";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useToasts } from "react-toast-notifications";

// Movie bileşeni, bir 'item' prop'unu alır; bu prop bir film veya dizi temsil eder
const Movie = ({ item }) => {
  // Beğeni durumunu ve şovun kaydedilmiş durumunu yönetmek için state'ler
  const [like, setLike] = useState(false);
  const [setSaved] = useState(false);

  // AuthContext'ten kullanıcı bilgilerini alma
  const { user } = UserAuth();

  // Bildirimleri göstermek için react-toast-notifications'dan addToast fonksiyonunu alma
  const { addToast } = useToasts();

  // Firestore'daki kullanıcının kaydedilmiş şovlarını temsil eden doküman referansını oluşturma
  const movieID = doc(db, "users", `${user?.email}`);

  // Kullanıcının kalp ikonuna tıkladığında şovu kaydetmek için fonksiyon
  const saveShow = async () => {
    // Kullanıcının giriş yapmış olup olmadığını kontrol etme
    if (user?.email) {
      // Beğeni durumunu tersine çevirme ve şovun kaydedildiği olarak işaretlenme
      setLike(!like);
      setSaved(true);

      try {
        // Firestore dokümanını güncelleyerek yeni kaydedilmiş şovu ekleme
        await updateDoc(movieID, {
          savedShows: arrayUnion({
            id: item.id,
            title: item.title,
            img: item.backdrop_path,
          }),
        });

        // Kullanıcıya şovun başarıyla kaydedildiğini bildirme (3 saniye süreyle görüntüleme)
        addToast("Show saved successfully!", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });
      } catch (error) {
        // Şovu kaydetme konusunda bir sorun olması durumunda hata işleme
        console.error("Error saving show:", error);
        addToast("Error saving show. Please try again later.", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });
      }
    } else {
      // Kullanıcı giriş yapmamışsa şovu kaydetmeye çalıştığını bildirme
      addToast("Please log in to save the show.", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    }
  };

  return (
    <div className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] inline-block relative p-2 transform transition-transform duration-300 hover:scale-110">
      <div className="relative group">
        <img
          className="w-full h-auto block"
          src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
          alt={item?.title}
        />
        <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 bg-black/80 text-white flex flex-col justify-center items-center text-center">
          <p className="white-space-normal text-md md:text-lg font-bold mb-2">
            {item?.title}
          </p>
          <p
            onClick={saveShow}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            {like ? (
              <FaHeart className="text-red-500 text-2xl" />
            ) : (
              <FaRegHeart className="text-gray-300 text-2xl" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// PropTypes kullanarak 'item' prop'unun doğru şekilde belirlenmesini sağlama
Movie.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    backdrop_path: PropTypes.string,
  }).isRequired,
};

export default Movie;
