import React, { useState } from "react";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    youtube: [],
    articles: [],
    papers: [],
    blogs: [],
  });
  const [filters, setFilters] = useState({
    youtube: false,
    articles: false,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?q=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleFilterChange = (filterType) => {
    setFilters({ ...filters, [filterType]: !filters[filterType] });
  };

  return (
    <div className="App">
      <h1>Search Engine</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="checkboxes">
        <label>
          <input
            type="checkbox"
            checked={filters.youtube}
            onChange={() => handleFilterChange("youtube")}
          />
          YouTube Videos
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.articles}
            onChange={() => handleFilterChange("articles")}
          />
          Articles
        </label>
      </div>

      {filters.youtube && (
        <div>
          <h2>YouTube Results:</h2>
          <ul>
            {searchResults.youtube.map((video, index) => (
              <li key={index}>
                <a href={video.link} target="_blank" rel="noopener noreferrer">
                  <img src={video.thumbnail} alt={video.title} />
                  <p>{video.title}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {filters.articles && (
        <div>
          <h2>Articles to read:</h2>
          <ul>
            {searchResults.articles.map((article, index) => (
              <li key={index}>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="" alt={article.title} />
                  <p>{article.title}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
