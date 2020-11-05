import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Button, Image } from "react-bootstrap";
import "./ProfilePage.scss";
import PageWithMenu from "../../components/PageWithMenu";
import PostsList from "../../components/PostsList";
import ImageUploadModal from "../../components/ImageUploadModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'

function ProfilePage({loggedUser}){
  const { nickname } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    async function fetchUserData(){
      const response = await axios.get(`http://localhost:9000/users/${nickname}`, {
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
      setUser(response.data)
    }

    async function fetchUserPosts() {
      const response = await axios.get(`http://localhost:9000/users/${nickname}/posts`, {
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
      setPosts(response.data)
    }

    fetchUserData()
    fetchUserPosts()
  }, [nickname])

  if (!user) {
    return <div>Carregando...</div>
  }

  return(
    <div className="profilePage">
      <PageWithMenu loggedUser={loggedUser}>
        <ProfileHeader user={user} loggedUser={loggedUser}/>
        <PostsList posts={posts} loggedUser={loggedUser}/>
      </PageWithMenu>
    </div>
  )
}

function ProfileHeader({ user, loggedUser }) {
  const isMe = loggedUser && user.id === loggedUser.id

  return (
    <div>
      <ProfileHeaderCover user={user} isMe={isMe} />
      <ProfileHeaderAvatar user={user} isMe={isMe} />
      <ProfileHeaderUserInformation user={user} isMe={isMe} />
    </div>
  )
}

function ProfileHeaderCover ({ user, isMe }) {
  const [isCoverModalOpen,setIsCoverModalOpen] = useState(false)

  return (
    <>
      <div className="profileCover" style={{backgroundImage:`url("${user.cover_url}")`}}>
        {isMe && (
          <Button 
            variant="light" 
            size="sm" 
            className="editCoverButton" 
            onClick={ ()=> setIsCoverModalOpen(true)}
          >
            <FontAwesomeIcon icon={faCamera} /> {" "}Editar capa
          </Button>
        )}
      </div>

      {isMe && (
        <ImageUploadModal
          userFieldName="cover_url"
          show={ isCoverModalOpen }
          handleClose={ ()=> setIsCoverModalOpen(false) }
        />
      )}
    </>
  )
}

function ProfileHeaderAvatar ({ user, isMe, loggedUser }) {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  return (
    <div>
      <Image className="profileAvatar" src={user.avatar_url} roundedCircle/>
      
      {isMe && (
        <Button variant="light" className="editAvatarButton " onClick={ ()=> setIsAvatarModalOpen(true)}><FontAwesomeIcon icon={faCamera} /></Button>
      )}

      {isMe && (
        <ImageUploadModal
          userFieldName="avatar_url"
          show={ isAvatarModalOpen }
          handleClose={ ()=> setIsAvatarModalOpen(false) }
        />
      )}
    </div>
  )
}

function ProfileHeaderUserInformation({ user, isMe }) {
  async function follow(){
    const response = await axios.post(`http://localhost:9000/users/${user.nickname}/follow`,{},{
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
    window.location.reload()
  }
  async function unFollow(){
    const response = await axios.delete(`http://localhost:9000/users/${user.nickname}/follow`,{
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
    window.location.reload()
  }
  return (
    <div className="profileUserInformation">
      {!isMe && !user.followedByMe && <Button className="buttonFollow" variant="primary" onClick={follow}>Seguir</Button> }
      {!isMe && user.followedByMe && <Button className="buttonFollow buttonUnFollow" variant="primary" onClick={unFollow}>Seguindo</Button> }
      
      <div className="profileUserName">
        {user.name}
      </div>
      <div className="profileUserNickname">
        @{user.nickname}
      </div>
    </div>
  )
}

export default ProfilePage;