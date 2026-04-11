import {useState, useEffect} from "react";
import CardGrid from "../components/CardGrid";
import ArtistCard from "../components/ArtistCard.jsx";
import supabase from "../services/supabase.js";
import hero from "../assets/hero.jpg";

const Artists = () => {

    const[artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async () => {
            const { data } = await supabase
                .from("artists")
                .select("*");
            setArtists(data);
        };
        fetchArtists();
    }, []);

    return (
        <section>
            <div>
                <img src={hero} alt="Hero" />
                <h1>Artists</h1>
            </div>
            <CardGrid data={artists} Card={ArtistCard} />
        </section>
    );
};

export default Artists;