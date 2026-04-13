const CardGrid = ({data, Card}) => {
    return (
        <div className="grid grid-cols-4">
            {data.map( entry => (
                <Card key={entry.artist_id || entry.genre_id || entry.id} data={entry} />
            ))}
        </div>
    );
};
export default CardGrid;