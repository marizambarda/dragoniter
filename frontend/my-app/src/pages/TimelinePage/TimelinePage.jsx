import React, { useState, useEffect } from "react";
import api from "../../api";
import { Container, Row, Col } from "react-bootstrap";
import "./TimelinePage.scss";
import PageWithMenu from "../../components/PageWithMenu";
import PostsList from "../../components/PostsList";
import CreatePostForm from "../../components/CreatePostForm";
import LoadingIndicator from "../../components/LoadingIndicator";


function TimelinePage({loggedUser}){
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    async function getPosts(){
      setIsLoading(true)
      const response = await api.get('/posts')
      setIsLoading(false)
      if (response.ok) {
        setPosts(response.data)
      }
    }
    getPosts();
    
  },[])

  return(
    <div className="timelinePage">
      <PageWithMenu loggedUser={loggedUser}>
        <div class="createPostFormContainer">
          <CreatePostForm loggedUser={loggedUser} defaultText={""} buttonText={"Twittar"}/>
        </div>
        {isLoading && <LoadingIndicator/>}
        {!isLoading && (
          <PostsList posts={posts} loggedUser={loggedUser}/>
        )}   
      </PageWithMenu>
    </div>
  )
}



export default TimelinePage;