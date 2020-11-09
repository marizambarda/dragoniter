import React from "react";
import { Image } from "react-bootstrap";
import "./UsersList.scss";
import { Link } from "react-router-dom";

function UsersList({users}){
  return(
    <div className="contentUserInformationsList">
      {users.map(user=><User key={user.id} user={user}/>)}
    </div>
  )
}

function User({ user }){
  return(
    <Link className="contentUserInformations" to={`/${user.nickname}`}>
      <div className="userAvatar">
        <Image src={user.avatar_url} roundedCircle/>
      </div>
      <div className="userIdentification">
        <div>{user.name}</div>
        <div>@{user.nickname}</div>
      </div>
    </Link>
  )
}



export default UsersList;