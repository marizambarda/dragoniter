import React, { useState, useCallback } from 'react';
import api from '../../api';
import { Form, Button } from 'react-bootstrap';
import { useAppContext } from '../../AppContext';
import LoadingIndicator from '../LoadingIndicator';
import ProfileImage from '../../components/ProfileImage';
import './CreatePostForm.scss';

function CreatePostForm({ defaultText, buttonText, showUserAvatar }) {
  const { loggedUser } = useAppContext();
  const [postBody, setPostBody] = useState(defaultText);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const autoFocus = useCallback((el) => {
    if (el) {
      el.focus();
      el.setSelectionRange(postBody.length, postBody.length);
    }
  }, []);

  async function formSubmited(e) {
    e.preventDefault();
    setIsLoading(true);
    await api.post(`/posts`, { body: postBody });
    window.location.reload();
    setIsLoading(false);
  }
  return (
    <div className="createPostForm">
      <Form className="clearfix" onSubmit={formSubmited}>
        <div
          className={`informationCreatePostForm ${isFocused ? 'focus' : ''}`}
        >
          {showUserAvatar && (
            <ProfileImage
              src={loggedUser && loggedUser.avatar_url}
              className="profileImageForm"
            />
          )}
          <textarea
            className="texteareaTimeline"
            ref={autoFocus}
            placeholder={
              'No que você está pensando, ' +
              (loggedUser ? loggedUser.name : '') +
              '?'
            }
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <Button
          className="buttonSubmitPost"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading && <LoadingIndicator small />}
          {isLoading ? ' Enviando' : buttonText}
        </Button>
      </Form>
    </div>
  );
}

export default CreatePostForm;
