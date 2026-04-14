/**
 * Artist page component for fetching and siaplying a list of artists from the database
 */

import {useState, useEffect} from "react";
import CardGrid from "../components/CardGrid";
import ArtistCard from "../components/ArtistCard.jsx";
import supabase from "../services/supabase.js";
import hero from "../assets/hero.jpg";

const Artists = () => {

    const[artists, setArtists] = useState([]); // state to store artist data from database

    // effect hook to fetch artist data
    useEffect(() => {
        const fetchArtists = async () => {
            const { data } = await supabase
                .from("artists")
                .select("*");
            setArtists(data); // update state with retrieved data 
        };

        fetchArtists();

    }, []);

    return (
        <section className="p-8">
            
            {/* hero banner with title */}
            <div className="relative mb-12 h-32">
                <img src={hero} alt="Hero" className="h-full w-full object-cover rounded-lg shadow-lg" />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                    <h1 className="text-6xl font-bold text-white drop-shadow-lg">Artists</h1>
                </div>
            </div>

            {/* grid of artist cards */}
            <CardGrid data={artists} Card={ArtistCard} />
        </section>
    );
};

export default Artists;