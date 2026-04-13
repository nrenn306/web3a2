import { useNavigate} from "react-router-dom";

const ArtistCard = ({ data }) => {
    
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/artists/${data.artist_id}`, { state: { artist: data } })}>
            <div>
                <img src={data.artist_image_url} alt={data.artist_name} />
            </div>
            <p>{data.artist_name}</p>
        </div>
    );
};

export default ArtistCard;