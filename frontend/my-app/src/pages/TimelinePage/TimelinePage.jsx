import React, { useState, useEffect } from 'react';
import api from '../../api';
import './TimelinePage.scss';
import PageWithMenu from '../../components/PageWithMenu';
import PostsList from '../../components/PostsList';
import CreatePostForm from '../../components/CreatePostForm';
import LoadingIndicator from '../../components/LoadingIndicator';
import Search from '../../components/Search';
import { useHistory } from 'react-router-dom';

function TimelinePage() {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getPosts() {
      setIsLoading(true);
      const response = await api.get('/posts');
      setIsLoading(false);
      if (response.ok) {
        setPosts(response.data);
      }
    }
    getPosts();
  }, []);

  return (
    <div className="timelinePage">
      <PageWithMenu>
        <div className="createPostFormContainer">
          <Search onSubmit={(term) => history.push(`/search?term=${term}`)} />
          <CreatePostForm defaultText={''} buttonText={'Twittar'} />
        </div>
        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <div>
            <PostsList posts={posts} />
            {posts.lenght === 0 && (
              <div className="doesntHaveInformation">
                Você ainda não possui twiites, siga outros usuários ou twitte
                algo.
              </div>
            )}
          </div>
        )}
      </PageWithMenu>
    </div>
  );
}

export default TimelinePage;
