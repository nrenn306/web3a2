import { useNavigate} from "react-router-dom";
import genreImg from "../assets/genre.png";

const GenreCard = ({ data }) => {
    
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/genres/${data.genre_id}`)}>
            <div>
                <img src={genreImg} alt={data.genre_name} />
            </div>
            <p>{data.genre_name}</p>
        </div>
    );
};

export default GenreCard;