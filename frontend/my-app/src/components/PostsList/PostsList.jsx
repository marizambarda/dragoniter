import React from "react";
import "./PostsList.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons' 


function PostsList({posts, loggedUser}){
  return(
    <div>
      {posts.map(post=><Post key={post.id} post={post} loggedUser={loggedUser}/>)}
    </div>
  )
}

function Post({post, loggedUser}){
  const isMe = loggedUser && post.user_id === loggedUser.id

  async function deleteTwitte(){
    if(window.confirm(`Tem certeza que deseja deletar?`)){
      await axios.delete(`http://localhost:9000/post/${post.id}`,{
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
    }
    window.location.reload()
  }
  return(
    <div className="postsList">
      {isMe &&(
        <Button className="btnDeletePost" variant="light" onClick={deleteTwitte}><FontAwesomeIcon icon={faTrashAlt} /></Button>
        )
      }
      <div className="userNamePostTimeline">
        <Link to={`/${post.nickname}`}>{post.name}</Link> 
      </div>
      
      <div>{post.body}</div>
    </div>
  )
}

export default PostsList;