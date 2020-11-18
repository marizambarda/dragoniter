import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useParams } from 'react-router';
import PageWithMenu from '../../components/PageWithMenu';
import UsersList from '../../components/UsersList';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useAppContext } from '../../AppContext';

function FollowingPage() {
  const { nickname } = useParams();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isMe } = useAppContext();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const response = await api.get(`/users/${nickname}/following`);
      setFollowing(response.data);

      const user = await api.get(`/users/${nickname}`);
      setUserId(user.data.id);

      setUsers(response.data);
      setIsLoading(false);
    }
    loadData();
  }, []);
  return (
    <PageWithMenu>
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <div>
          <h1 className="pageTitle">Seguindo</h1>
          <UsersList users={following} />
          {following.length === 0 && (
            <div className="doesntHaveInformation">
              {isMe(userId) && <div>Você ainda não está seguindo usuários</div>}
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

export default FollowingPage;
