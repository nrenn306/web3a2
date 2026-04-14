/**
 * CardGrid component for displaying a grid layout of reusable card components
 * 
 * props:
 * @param {Array<Object>} data - array of data objects to render
 * @param {React.Component} Card - component used to render each data item
 */

const CardGrid = ({data, Card}) => {
    return (
        <div className="grid grid-cols-5 gap-6 px-8">
            {data.map( entry => (
                <div key={entry.artist_id || entry.genre_id || entry.id} className="h-64">
                    {/* render passed-in card component with entry data */}
                    <Card data={entry} />
                </div>
            ))}
        </div>
    );
};

export default CardGrid;