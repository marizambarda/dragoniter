import React, { useState, useEffect } from "react";
import api from "../../api";
import { useParams } from "react-router";
import PageWithMenu from "../../components/PageWithMenu";
import UsersList from "../../components/UsersList";


function FollowersPage({loggedUser}){
  const { nickname } = useParams();
  const [users, setUsers] = useState([]);
  useEffect(()=>{
    async function loadData(){
      const response = await api.get(`/users/${nickname}/followers`)
      setUsers(response.data)
      console.log(response.data)
    }
    loadData()
  },[])
  return(
    <PageWithMenu loggedUser={loggedUser}>
      <h1 className="titlePage">Seguidores</h1>
      <UsersList users={users}/>
    </PageWithMenu>
  )
}

export default FollowersPage;