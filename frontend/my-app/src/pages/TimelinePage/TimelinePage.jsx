import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import "./TimelinePage.scss";
import PageWithMenu from "../../components/PageWithMenu";
import PostsList from "../../components/PostsList";
import CreatePostForm from "../../components/CreatePostForm";


function TimelinePage({loggedUser}){
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    async function getPosts(){
      try{
        const response = await axios.get(`http://localhost:9000/posts`,{
          headers: {
            access_token: localStorage.getItem("access_token")
          }
        })
        setPosts(response.data)
      } 
      catch (error){
        if (error.response) {
          alert(error.response.data.error)
        } else {
          throw error
        }
      }
    }
    getPosts();
    
  },[])

  return(
    <div className="timelinePage">
      <PageWithMenu loggedUser={loggedUser}>
        <CreatePostForm loggedUser={loggedUser} />
        <PostsList posts={posts}/>
      </PageWithMenu>
    </div>
  )
}



export default TimelinePage;