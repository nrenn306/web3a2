import {useState, useEffect} from "react";
import CardGrid from "../components/CardGrid";
import GenreCard from "../components/GenreCard.jsx";
import supabase from "../services/supabase.js";
import hero from "../assets/hero.jpg";

const Genres = () => {

    const[genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            const { data } = await supabase
                .from("genres")
                .select("*");
            setGenres(data);
        };
        fetchGenres();
    }, []);

    return (
        <section className="p-8">
            <div className="relative mb-12 h-32">
                <img src={hero} alt="Hero" className="h-full w-full object-cover rounded-lg shadow-lg" />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                    <h1 className="text-6xl font-bold text-white drop-shadow-lg">Genres</h1>
                </div>
            </div>
            <CardGrid data={genres} Card={GenreCard} />
        </section>
    );
};

export default Genres;