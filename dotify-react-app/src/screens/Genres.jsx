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
        <section>
            <div>
                <img src={hero} alt="Hero" />
                <h1>Genre</h1>
            </div>
            <CardGrid data={genres} Card={GenreCard} />
        </section>
    );
};

export default Genres;