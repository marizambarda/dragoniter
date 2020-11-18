import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useParams } from 'react-router';
import PageWithMenu from '../../components/PageWithMenu';
import UsersList from '../../components/UsersList';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useAppContext } from '../../AppContext';

function FollowersPage() {
  const { nickname } = useParams();
  const [userId, setUserId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isMe } = useAppContext();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const response = await api.get(`/users/${nickname}/followers`);
      setFollowers(response.data);

      const user = await api.get(`/users/${nickname}`);
      setUserId(user.data.id);

      setIsLoading(false);
    }
    loadData();
  }, []);
  return (
    <PageWithMenu>
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <div>
          <h1 className="pageTitle">Seguidores</h1>
          <UsersList users={followers} />
          {followers.length === 0 && (
            <div className="doesntHaveInformation">
              {isMe(userId) && <div> Você ainda não possui seguidores </div>}
              {!isMe(userId) && (
                <div> Esse usuário ainda não possui seguidores </div>
              )}
            </div>
          )}
        </div>
      )}
    </PageWithMenu>
  );
}

export default FollowersPage;
