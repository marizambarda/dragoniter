import React from "react";
import "./PostsList.scss";
import { Link } from "react-router-dom";

function PostsList({posts}){
  return(
    <div>
      {posts.map(post=><Post key={post.id} post={post}/>)}
    </div>
  )
}

function Post({post}){
  return(
    <div className="postsList">
      <div className="userNamePostTimeline"><Link to={`/${post.nickname}`}>{post.name}</Link></div>
      <div>{post.body}</div>
    </div>
  )
}

export default PostsList;