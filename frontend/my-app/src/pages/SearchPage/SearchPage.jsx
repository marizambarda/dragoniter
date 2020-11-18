import { useEffect } from 'react';
import { useState } from 'react';
import UsersList from '../../components/UsersList';
import api from '../../api';
import qs from 'qs';
import PageWithMenu from '../../components/PageWithMenu/PageWithMenu';
import Search from '../../components/Search';

function SearchPage({ location }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const params = qs.parse(window.location.search.replace('?', ''));
    async function loadData() {
      const response = await api.get(`/users/search?term=${params.term}`);
      setUsers(response.data);
    }
    loadData();
  }, [window.location.search]);

  return (
    <div>
      <PageWithMenu>
        <Search />
        <UsersList users={users} />
        {users.length === 0 && (
          <div className="doesntHaveInformation">
            Não encontramos nenhum usuário com esse nome.
          </div>
        )}
      </PageWithMenu>
    </div>
  );
}

export default SearchPage;
