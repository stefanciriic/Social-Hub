import { useState } from "react";
import { useSelector } from "react-redux";
import "./Search.css";
import { callApi } from "../../helpers/callApi";
import { useNavigate } from "react-router-dom";

export const Search = () => {
  const user = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    search(query);
  };

  const search = async (query) => {
    try {
      const results = await callApi(
        `search?searchTerm=${query}`,
        "get",
        user.token
      );
      setSearchResults(results);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNavigaToProfile = (username) => {
    navigate(`/profile/${username}`);
    setSearchQuery("");
  };

  return (
    <div className="search">
      <form className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>
      {searchResults.length > 0 && searchQuery !== "" ? (
        <div className="result">
          {searchResults.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                handleNavigaToProfile(user.username);
              }}
              className="search-profile"
            >
              <div className="search-profile-picture">
                <img src={user.profilePicture} alt="" />
              </div>
              <div className="search-profile-info">
                {user.firstName} {user.lastName}
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
