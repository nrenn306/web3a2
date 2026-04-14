/**
 * genre page component for fetching and displaying a list of genres from the database
 */

import {useState, useEffect} from "react";
import CardGrid from "./CardGrid";
import GenreCard from "./GenreCard.jsx";
import supabase from "../services/supabase.js";
import hero from "../assets/hero.jpg";

const Genres = () => {

    const[genres, setGenres] = useState([]); // state to store genre data from database

    // effect hook to fetch genre data 
    useEffect(() => {
        const fetchGenres = async () => {
            const { data } = await supabase
                .from("genres")
                .select("*");
            setGenres(data); // update state with retrieved data 
        };

        fetchGenres();

    }, []);

    return (
        <section className="p-8">
            {/* hero banner with title */}
            <div className="relative mb-12 h-32">
                <img src={hero} alt="Hero" className="h-full w-full object-cover rounded-lg shadow-lg" />
                
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                    <h1 className="text-6xl font-bold text-white drop-shadow-lg">Genres</h1>
                </div>

            </div>
            
            {/* grid of genre cards */}
            <CardGrid data={genres} Card={GenreCard} />
        </section>
    );
};

export default Genres;