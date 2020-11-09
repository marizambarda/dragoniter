import React, { useState, useEffect } from "react";
import api from "../../api";
import { useParams } from "react-router";
import PageWithMenu from "../../components/PageWithMenu";
import UsersList from "../../components/UsersList";
import LoadingIndicator from "../../components/LoadingIndicator";


function FollowersPage({loggedUser}){
  const { nickname } = useParams();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    async function loadData(){
      setIsLoading(true)
      const response = await api.get(`/users/${nickname}/followers`)
      setUsers(response.data)
      setIsLoading(false)
    }
    loadData()
  },[])
  return(
    <PageWithMenu loggedUser={loggedUser}>
      {isLoading && <LoadingIndicator/>}
      {!isLoading && (
        <div>
          <h1 className="titlePage">Seguidores</h1>
          <UsersList users={users}/>
        </div>
      )}
    </PageWithMenu>
  )
}

export default FollowersPage;