import { MoreVert } from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "./Post.css";
// import { Users } from "../../dummyData";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  // console.log(post);
  // const user = Users.filter((user) => user.id === 1);
  // console.log(user[0].username);
  const [like, setLike] = useState(post.likes ? post.likes.length : 0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

  // 以下のようにプロパティ名を変更する、以下はログイン中のユーザー名
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      // const res = await axios.get(`/users/${post.userId}`);
      const res = await axios.get(`/api/users?userId=${post.userId}`);
      setUser(res.data);
      // console.log(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const handleLike = async () => {
    try {
      //いいねのAPIを叩く
      await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PUBLIC_FOLDER + user.profilePicture
                    : PUBLIC_FOLDER + "person/noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <div className="postTopLeftDetail">
              <span className="postUsername">{user.username}</span>
              <span className="postUserOrg">{user.org}</span>
              <span className="postDate">{format(post.createdAt)}</span>
            </div>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          <img className="postImg" src={PUBLIC_FOLDER + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={PUBLIC_FOLDER + "/heart.png"}
              alt=""
              onClick={() => handleLike()}
            />
            <span className="postLikeCounter">
              {like}人がいいねを押しました
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment}:コメント</span>
          </div>
        </div>
      </div>
    </div>
  );
}