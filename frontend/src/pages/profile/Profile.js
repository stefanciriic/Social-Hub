import "./Profile.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "../../components/Header/Header";
import { useEffect, useState, useReducer } from "react";
import { profileReducer } from "../../functions/reducers";
import { callApi } from "../../helpers/callApi";
import { ProfileHeader } from "../../components/Profile/ProfileHeader";
import { CreatePost } from "../../components/CreatePost/CreatePost";
import { Post } from "../../components/Post/Post";

export const Profile = () => {
  const user = useSelector((state) => state.user);
  const [result, setResult] = useState({});
  const [{ loading, error, response }, dispatch] = useReducer(profileReducer, {
    loading: false,
    response: {},
    error: "",
  });
  const { username } = useParams();

  useEffect(() => {
    getProfile();
  }, [username]);

  const getProfile = async () => {
    try {
      dispatch({ type: "PROFILE_REQUEST" });
      const data = await callApi(`profile/${username}`, "get", user.token);
      setResult(data);
      dispatch({ type: "PROFILE_SUCCESS", payload: result });
    } catch (err) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  return (
    <>
      <Header />
      {loading ? null : result ? (
        <>
          <ProfileHeader data={result} loading={loading} />
          <div className="profile-body">
            <div className="profile-middle">
              {user.id === result.profile?._id ? <CreatePost /> : null}
              <div className="user-posts">
                {result.posts?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((post, i) => (
                    <Post key={i} post={post} user={user} loading={loading} />
                  ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};
