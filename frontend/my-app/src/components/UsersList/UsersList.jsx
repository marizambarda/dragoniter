import React from "react";
import { Image } from "react-bootstrap";
import "./UsersList.scss";
import { Link } from "react-router-dom";
import ProfileImage from "../../components/ProfileImage";

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
        <ProfileImage src={user.avatar_url} />
      </div>
      <div className="userIdentification">
        <div className="userName">{user.name}</div>
        <div>@{user.nickname}</div>
      </div>
    </Link>
  )
}



export default UsersList;