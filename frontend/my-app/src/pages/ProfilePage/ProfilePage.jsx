import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import api from "../../api";
import { Link } from "react-router-dom";
import { Button, Image} from "react-bootstrap";
import "./ProfilePage.scss";
import PageWithMenu from "../../components/PageWithMenu";
import PostsList from "../../components/PostsList";
import ImageUploadModal from "../../components/ImageUploadModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import LoadingIndicator from "../../components/LoadingIndicator";
import { useAppContext } from "../../AppContext";

function ProfilePage(){
  const { nickname } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    async function fetchUserData(){
      const response = await api.get(`/users/${nickname}`)
      setUser(response.data)
    }

    async function fetchUserPosts() {
      const response = await api.get(`/users/${nickname}/posts`)
      setPosts(response.data)
    }

    fetchUserData()
    fetchUserPosts()
  }, [nickname])

  return(
    <div className="profilePage">
      <PageWithMenu>
        {!user && <LoadingIndicator />}
        {user && (
          <div>
            <ProfileHeader user={user}/>
            <PostsList posts={posts}/>
          </div>
        )}
      </PageWithMenu>
    </div>
  )
}

function ProfileHeader({ user }) {
  const {loggedUser} = useAppContext()
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

function ProfileHeaderAvatar ({ user, isMe  }) {
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
  const {loggedUser} = useAppContext()
  
  async function follow(){
    await api.post(`/users/${user.nickname}/follow`, {})
    window.location.reload()
  }
  async function unFollow(){
    await api.delete(`/users/${user.nickname}/follow`)
    window.location.reload()
  }
  return (
    <div className="profileUserInformation">
      <div className="userIdentification ">
        <div className="profileUserName">
          {user.name}
        </div>
        
        <div className="profileUserNickname">
          @{user.nickname}
        </div>
      </div>
      <div className="following">
        <Link className="follow" to={`/${user.nickname}/following`}>{user.following} Seguindo </Link>
      </div>
      <div className="followers">
        <Link className="follow"  to={`/${user.nickname}/followers`}>{user.followers} Seguidores </Link>
      </div> 
      <div className="buttons">
      {loggedUser && !isMe && !user.followedByMe && <Button className="buttonFollow" variant="primary" onClick={follow}>Seguir</Button> }
      {!isMe && user.followedByMe && <Button className="buttonFollow buttonUnFollow" variant="primary" onClick={unFollow}>Seguindo</Button> }
      </div> 
    </div>
  )
}

export default ProfilePage;