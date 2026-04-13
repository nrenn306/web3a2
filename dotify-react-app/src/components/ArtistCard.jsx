import { useNavigate} from "react-router-dom";

const ArtistCard = ({ data }) => {
    
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/artists/${data.artist_id}`, { state: { artist: data } })} className="group cursor-pointer h-full">
            <div className="relative h-full overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300">
                <img src={data.artist_image_url} alt={data.artist_name} className="w-full h-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end">
                    <p className="text-white font-semibold text-lg p-4 w-full">{data.artist_name}</p>
                </div>
            </div>
        </div>
    );
};

export default ArtistCard;