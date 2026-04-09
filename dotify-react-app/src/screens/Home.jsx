import hero from "../assets/hero.png";

function Home() {
    
    return (
        <div className="text-center py-12">
            <div className="relative w-full overflow-hidden rounded-lg">
                <img src={hero} alt="Hero Image" className="w-full h-auto object-cover" />
                <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold drop-shadow-lg" style={{ fontSize: 'clamp(2rem, 8vw, 5rem)' }}>Welcome to Dotify</h1>
            </div>
        </div>
    );
}

export default Home;