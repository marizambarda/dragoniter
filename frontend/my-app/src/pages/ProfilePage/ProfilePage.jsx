import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import api from '../../api';
import { Link } from 'react-router-dom';
import { Button, Image } from 'react-bootstrap';
import './ProfilePage.scss';
import PageWithMenu from '../../components/PageWithMenu';
import PostsList from '../../components/PostsList';
import ImageUploadModal from '../../components/ImageUploadModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import LoadingIndicator from '../../components/LoadingIndicator';
import ProfileImage from '../../components/ProfileImage';
import { useAppContext } from '../../AppContext';

function ProfilePage() {
  const { isMe } = useAppContext();
  const { nickname } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      const response = await api.get(`/users/${nickname}`);
      setUser(response.data);
    }

    async function fetchUserPosts() {
      const response = await api.get(`/users/${nickname}/posts`);
      setPosts(response.data);
    }

    async function fetchData() {
      setIsLoading(true);
      await fetchUserData();
      await fetchUserPosts();
      setIsLoading(false);
    }

    fetchData();
  }, [nickname]);

  return (
    <div className="profilePage">
      <PageWithMenu>
        {isLoading && <LoadingIndicator />}
        {!isLoading && user && (
          <div>
            <ProfileHeader user={user} />
            <PostsList posts={posts} />

            {posts.length === 0 && (
              <div className="doesntHaveInformation">
                {isMe(user) && (
                  <div>
                    Você ainda não possui twitts!{' '}
                    <Link to={'/'}>Clique aqui para twittar</Link>
                  </div>
                )}
                {!isMe(user) && <div>Esse usuário ainda não possui twitts</div>}
              </div>
            )}
          </div>
        )}
      </PageWithMenu>
    </div>
  );
}

function ProfileHeader({ user }) {
  return (
    <div>
      <ProfileHeaderCover user={user} />
      <ProfileHeaderAvatar user={user} />
      <ProfileHeaderUserInformation user={user} />
    </div>
  );
}

function ProfileHeaderCover({ user }) {
  const { isMe } = useAppContext();
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  return (
    <>
      <div
        className="profileCover"
        style={{ backgroundImage: `url("${user.cover_url}")` }}
      >
        {isMe(user) && (
          <Button
            variant="light"
            size="sm"
            className="editCoverButton"
            onClick={() => setIsCoverModalOpen(true)}
          >
            <FontAwesomeIcon icon={faCamera} /> Editar capa
          </Button>
        )}
      </div>

      {isMe(user) && (
        <ImageUploadModal
          userFieldName="cover_url"
          show={isCoverModalOpen}
          handleClose={() => setIsCoverModalOpen(false)}
        />
      )}
    </>
  );
}

function ProfileHeaderAvatar({ user }) {
  const { isMe } = useAppContext();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  return (
    <div>
      <ProfileImage className="profileAvatar" src={user.avatar_url} />

      {isMe(user) && (
        <Button
          variant="light"
          className="editAvatarButton "
          onClick={() => setIsAvatarModalOpen(true)}
        >
          <FontAwesomeIcon icon={faCamera} />
        </Button>
      )}

      {isMe(user) && (
        <ImageUploadModal
          userFieldName="avatar_url"
          show={isAvatarModalOpen}
          handleClose={() => setIsAvatarModalOpen(false)}
        />
      )}
    </div>
  );
}

function ProfileHeaderUserInformation({ user }) {
  const { isMe } = useAppContext();
  const { loggedUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  async function follow() {
    setIsLoading(true);
    await api.post(`/users/${user.nickname}/follow`);
    window.location.reload();
  }
  async function unFollow() {
    setIsLoading(true);
    await api.delete(`/users/${user.nickname}/follow`);
    window.location.reload();
  }
  return (
    <div className="profileUserInformation">
      <div className="userIdentification ">
        <div className="profileUserName">{user.name}</div>

        <div className="profileUserNickname">@{user.nickname}</div>
      </div>
      <div className="following">
        <Link className="follow" to={`/${user.nickname}/following`}>
          {user.following} Seguindo{' '}
        </Link>
      </div>
      <div className="followers">
        <Link className="follow" to={`/${user.nickname}/followers`}>
          {user.followers} Seguidores{' '}
        </Link>
      </div>
      <div className="buttons">
        {loggedUser && !isMe(user) && !user.followedByMe && (
          <Button variant="secondary" onClick={follow} disabled={isLoading}>
            {isLoading ? <LoadingIndicator small /> : 'Seguir'}
          </Button>
        )}
        {!isMe(user) && user.followedByMe && (
          <Button variant="primary" onClick={unFollow} disabled={isLoading}>
            {isLoading ? <LoadingIndicator small /> : 'Seguindo'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
