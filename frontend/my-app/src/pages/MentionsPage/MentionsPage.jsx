import React, { useEffect, useState } from "react";
import PageWithMenu from "../../components/PageWithMenu";
import axios from "axios";
import PostsList from "../../components/PostsList/PostsList";
import "./MentionsPage.scss";

function MentionsPage({loggedUser}){
  const [posts, setPosts] =  useState([])
  useEffect(()=>{
    async function loadMentions(){
      const response = await axios.get(`http://localhost:9000/mentions`, {
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
      setPosts(response.data)
    }  
    loadMentions();
  }, [])
  return(
    <PageWithMenu loggedUser={loggedUser} >
      <h1 className="titleMentionsPage">Menções</h1>
      <PostsList posts={posts} loggedUser={loggedUser}/>  
    </PageWithMenu>
  )
}
export default MentionsPage;