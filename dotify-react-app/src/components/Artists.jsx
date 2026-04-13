import {useState, useEffect} from "react";
import CardGrid from "./CardGrid";
import ArtistCard from "./ArtistCard.jsx";
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
        <section className="p-8">
            <div className="relative mb-12 h-32">
                <img src={hero} alt="Hero" className="h-full w-full object-cover rounded-lg shadow-lg" />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                    <h1 className="text-6xl font-bold text-white drop-shadow-lg">Artists</h1>
                </div>
            </div>
            <CardGrid data={artists} Card={ArtistCard} />
        </section>
    );
};

export default Artists;