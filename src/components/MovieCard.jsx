import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { useState, useRef, useEffect } from "react";

function MovieCard({ movie }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);
    const [showOverview, setShowOverview] = useState(false);
    const [hidingOverview, setHidingOverview] = useState(false);
    const overviewRef = useRef();

    function onFavoriteClick(e) {
        e.preventDefault();
        favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
    }

    function handleCloseOverview() {
        setHidingOverview(true);
        setTimeout(() => {
            setShowOverview(false);
            setHidingOverview(false);
        }, 400); // Matches CSS animation duration
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (overviewRef.current && !overviewRef.current.contains(event.target)) {
                handleCloseOverview();
            }
        }

        if (showOverview) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showOverview]);

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                        ❤
                    </button>
                    <div className="movie-details">
                        <h3>{movie.title}</h3>
                        <p>{movie.release_date.split("-")[0]}</p>
                        <p className="user-rating">⭐ {movie.vote_average}</p>
                    </div>
                    <button className="show-overview-btn" onClick={() => setShowOverview(true)}>
                        Overview
                    </button>
                </div>

                {/* Overview Overlay */}
                {showOverview && (
                    <div
                        className={`overview-overlay ${showOverview ? "show" : ""} ${hidingOverview ? "hiding" : ""}`}
                        ref={overviewRef}
                    >
                        <button className="close-btn" onClick={handleCloseOverview} style={{ outline: "none" }}>×</button>
                        <p>{movie.overview}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieCard;
