import { useEffect } from 'react';
import { useState } from 'react';
import UsersList from '../../components/UsersList';
import api from '../../api';
import qs from 'qs';
import PageWithMenu from '../../components/PageWithMenu/PageWithMenu';
import Search from '../../components/Search';
import LoadingIndicator from '../../components/LoadingIndicator';
import './SearchPage.scss';

function SearchPage({ location }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadData(term) {
    setIsLoading(true);
    const response = await api.get(`/users/search?term=${term}`);
    setUsers(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    const params = qs.parse(window.location.search.replace('?', ''));

    loadData(params.term);
  }, [window.location.search]);

  return (
    <div>
      <PageWithMenu>
        <div className="searchPadding">
          <Search onSubmit={(term) => loadData(term)} />
        </div>
        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <>
            <UsersList users={users} />
            {users.length === 0 && (
              <div className="doesntHaveInformation">
                Não encontramos nenhum usuário com esse nome.
              </div>
            )}
          </>
        )}
      </PageWithMenu>
    </div>
  );
}

export default SearchPage;
