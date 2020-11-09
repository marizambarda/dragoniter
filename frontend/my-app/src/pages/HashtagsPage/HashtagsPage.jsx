import React, { useState, useEffect } from "react";
import api from "../../api";
import { useParams } from "react-router";
import PageWithMenu from "../../components/PageWithMenu";
import PostsList from "../../components/PostsList/PostsList";
import "./HashtagsPage.scss";

function HashtagsPage({loggedUser}){
  const [posts, setPosts] =  useState([])
  const { hashtag } = useParams();

  useEffect(()=>{
    async function loadHashtags(){
      const response = await api.get(`/hashtags/${hashtag}/posts`)
      setPosts(response.data)
    }  
    loadHashtags();
  }, [])
  return(
    <PageWithMenu loggedUser={loggedUser} >
      <h1 className="titleMentionsPage">#{hashtag}</h1>
      <PostsList posts={posts} loggedUser={loggedUser}/>  
    </PageWithMenu>
  )
}

export default HashtagsPage;