import { useState } from "react";
import PropTypes from "prop-types";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useToasts } from "react-toast-notifications";

const Movie = ({ item }) => {
  const [like, setLike] = useState(false);
  const [setSaved] = useState(false);
  const { user } = UserAuth();
  const { addToast } = useToasts();

  const movieID = doc(db, "users", `${user?.email}`);

  const saveShow = async () => {
    if (user?.email) {
      setLike(!like);
      setSaved(true);

      try {
        await updateDoc(movieID, {
          savedShows: arrayUnion({
            id: item.id,
            title: item.title,
            img: item.backdrop_path,
          }),
        });

        // Notify the user that the show has been saved
        addToast("Show saved successfully!", { appearance: "success" });
      } catch (error) {
        console.error("Error saving show:", error);
        addToast("Error saving show. Please try again later.", {
          appearance: "error",
        });
      }
    } else {
      addToast("Please log in to save the show.", { appearance: "error" });
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

Movie.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    backdrop_path: PropTypes.string,
  }).isRequired,
};

export default Movie;
