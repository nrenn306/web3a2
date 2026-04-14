/**
 * genreCard component for displying clickable card for music genre
 * 
 * props:
 * @param {Object} data - object containing genre information
 * @param {string|number} data.genre_id - unique identifier for the genre
 * @param {string} data.genre_name - name of the genre
 */

import { useNavigate} from "react-router-dom";
import genreImg from "../assets/genre.png";

const GenreCard = ({ data }) => {
    
    // hook used to navigate between routes
    const navigate = useNavigate();

    // handles navigation to single genre page 
    const handleClick = () => {
        navigate(`/genres/${data.genre_id}`);
    };

    return (
        <div onClick={handleClick} className="group cursor-pointer h-full">
            <div className="relative h-full overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300">
                {/* genre image */}
                <img src={genreImg} alt={data.genre_name} className="w-full h-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end">
                    <p className="text-white font-semibold text-lg p-4 w-full">{data.genre_name}</p>
                </div>
            </div>
        </div>
    );
};

export default GenreCard;