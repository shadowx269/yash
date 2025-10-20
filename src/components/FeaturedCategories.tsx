import { Link } from 'react-router-dom';

const tiles = [
    { key: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469046-98bf6c561251?w=1200', cols: 'col-span-2', rows: 'row-span-2' },
    { key: 'Lehengas', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200', cols: 'col-span-1', rows: 'row-span-1' },
    { key: 'Kurti', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200', cols: 'col-span-1', rows: 'row-span-1' },
    { key: 'Indo Western Dress', image: 'https://images.unsplash.com/photo-1583391265855-4768eadf3e80?w=1200', cols: 'col-span-1', rows: 'row-span-1' },
    { key: 'Dupattas', image: 'https://images.unsplash.com/photo-1617519019082-2964fcdc29ad?w=1200', cols: 'col-span-1', rows: 'row-span-1' },
];

export const FeaturedCategories = () => {
    return (
        <section className="animate-fade-in" id="categories">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-heading font-bold text-foreground">Featured Categories</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">Explore our curated selections</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[120px] md:auto-rows-[160px]">
                {tiles.map((tile, i) => (
                    <Link
                        to={`/?cat=${encodeURIComponent(tile.key)}`}
                        key={tile.key}
                        className={`relative overflow-hidden rounded-2xl border-2 group ${tile.cols} ${tile.rows} shadow-lg`}
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <img
                            src={tile.image}
                            alt={tile.key}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-background/90 text-foreground border">
                                {tile.key}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};


