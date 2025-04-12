import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard"
import "../css/Home.css"
import { searchMovies, getPopularMovies } from "../services/api";

function Home() {

    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            }
            finally {
                setLoading(false)
            }
        }

        loadPopularMovies()
    }, [])

    const handleSearc = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        if (loading) return


        setLoading(true)
        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch (err) {
            setError("Failed to search movies...")
        } finally {
            setLoading(false)
        }

    };

    return (
        <div className="home">
            <form onSubmit={handleSearc} className="search-form">
                <input
                    type="text"
                    placeholder="Search for movies..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-button" type="submit">
                    <span className="search-text">Search</span>
                    <span className="search-icon">
                        <i className="fas fa-search"></i>
                    </span>
                </button>

            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            )
            }

        </div >
    )
}

export default Home;