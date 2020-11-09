import React, { useEffect, useState } from "react";
import PageWithMenu from "../../components/PageWithMenu";
import api from "../../api";
import PostsList from "../../components/PostsList/PostsList";
import "./MentionsPage.scss";
import LoadingIndicator from "../../components/LoadingIndicator";

function MentionsPage({loggedUser}){
  const [posts, setPosts] =  useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    async function loadMentions(){
      setIsLoading(true)
      const response = await api.get(`/mentions`)
      setIsLoading(false)
      setPosts(response.data)
    }  
    loadMentions();
  }, [])
  return(
    <PageWithMenu loggedUser={loggedUser} >
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <div>
          <h1 className="titlePage">Menções</h1>
          <PostsList posts={posts} loggedUser={loggedUser}/>  
        </div>
      )}
    </PageWithMenu>
  )
}
export default MentionsPage;