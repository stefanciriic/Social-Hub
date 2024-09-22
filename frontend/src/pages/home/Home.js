import "./Home.css";
import { useSelector } from "react-redux";
import { Header } from "../../components/Header/Header";
import { CreatePost } from "../../components/CreatePost/CreatePost";
import { Post } from "../../components/Post/Post";
import { callApi } from "../../helpers/callApi";
import { useEffect, useReducer, useRef } from "react";
import { postsReducer } from "../../functions/reducers";

export const Home = () => {
  const user = useSelector((state) => state.user);
  const [{ posts, loading, error }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch({ type: "POSTS_REQUEST" });
        const result = await callApi("getAllPosts", "get", user.token);
        dispatch({ type: "POSTS_SUCCESS", payload: result });
      } catch (error) {
        dispatch({
          type: "POSTS_ERROR",
          payload: error.response.data.message,
        });
      }
    };

    fetchPosts();
  }, [user.token]);

  return (
    <>
      <Header />
      <div className="home">
        <div className="home_left"></div>
        <div className="home_middle">
          <CreatePost user={user} />
          <div className="all-posts-home">
            {posts
              ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post, i) => (
                <Post key={i} post={post} user={user} loading={loading} />
              ))}
          </div>
        </div>
        <div className="home_right"></div>
      </div>
    </>
  );
};
