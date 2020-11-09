import React, { useEffect, useState } from "react";
import PageWithMenu from "../../components/PageWithMenu";
import api from "../../api";
import PostsList from "../../components/PostsList/PostsList";
import "./MentionsPage.scss";

function MentionsPage({loggedUser}){
  const [posts, setPosts] =  useState([])
  useEffect(()=>{
    async function loadMentions(){
      const response = await api.get(`/mentions`)
      setPosts(response.data)
    }  
    loadMentions();
  }, [])
  return(
    <PageWithMenu loggedUser={loggedUser} >
      <h1 className="titlePage">Menções</h1>
      <PostsList posts={posts} loggedUser={loggedUser}/>  
    </PageWithMenu>
  )
}
export default MentionsPage;