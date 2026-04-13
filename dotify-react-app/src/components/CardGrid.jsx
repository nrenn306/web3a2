const CardGrid = ({data, Card}) => {
    return (
        <div className="grid grid-cols-5 gap-6 px-8">
            {data.map( entry => (
                <div key={entry.artist_id || entry.genre_id || entry.id} className="h-64">
                    <Card data={entry} />
                </div>
            ))}
        </div>
    );
};
export default CardGrid;