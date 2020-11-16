import React, { useState, useEffect } from 'react';
import api from '../../api';
import './TimelinePage.scss';
import PageWithMenu from '../../components/PageWithMenu';
import PostsList from '../../components/PostsList';
import CreatePostForm from '../../components/CreatePostForm';
import LoadingIndicator from '../../components/LoadingIndicator';

function TimelinePage() {
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
          <CreatePostForm defaultText={''} buttonText={'Twittar'} />
        </div>
        {isLoading && <LoadingIndicator />}
        {!isLoading && <PostsList posts={posts} />}
      </PageWithMenu>
    </div>
  );
}

export default TimelinePage;
