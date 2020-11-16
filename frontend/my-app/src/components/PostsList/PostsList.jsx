import React, { useState } from 'react';
import './PostsList.scss';
import api from '../../api';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { DateTime } from 'luxon';
import LoadingIndicator from '../LoadingIndicator';
import { useAppContext } from '../../AppContext';
import CreatePostForm from '../../components/CreatePostForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import ProfileImage from '../ProfileImage';

function PostsList({ posts }) {
  return (
    <div className="postsList">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

function Post({ post }) {
  const { loggedUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [reply, setReply] = useState(false);
  const isMe = loggedUser && post.user_id === loggedUser.id;

  async function toggleReplyForm(e) {
    e.preventDefault();
    setReply(!reply);
  }

  async function deleteTwitte() {
    if (window.confirm(`Tem certeza que deseja deletar?`)) {
      setIsLoading(true);
      await api.delete(`/post/${post.id}`);
      setIsLoading(false);
    }
    window.location.reload();
  }
  return (
    <div className="post">
      <div className="postAvatar">
        <Link to={`/${post.nickname}`}>
          <ProfileImage src={post.avatar_url} />
        </Link>
      </div>

      <div className="postContent">
        <div className="userNamePostTimeline">
          <Link to={`/${post.nickname}`}>
            {post.name}{' '}
            <span className="timelineUserNickname"> @{post.nickname}</span>{' '}
          </Link>
        </div>
        <div>
          <PostBody body={post.body} />
        </div>
        <div className="showTime">
          <PostDateTime dateTime={post.created_at} />
        </div>

        {loggedUser && (
          <a href="#" className="replyIcon" onClick={toggleReplyForm}>
            <FontAwesomeIcon icon={faCommentDots} />
          </a>
        )}

        {reply === true && (
          <CreatePostForm
            defaultText={`@${post.nickname} `}
            buttonText={'Responder'}
          />
        )}
      </div>

      <div>
        {isMe && (
          <Button
            disabled={isLoading}
            className="btnDeletePost"
            variant="light"
            onClick={deleteTwitte}
          >
            {!isLoading && <FontAwesomeIcon icon={faTrashAlt} />}
            {isLoading && <LoadingIndicator small />}
          </Button>
        )}
      </div>
    </div>
  );
}

function PostBody({ body }) {
  const words = body.split(' ');

  return words.map((word) => {
    let returnedWord;

    if (word[0] === '@') {
      returnedWord = (
        <Link className="linkMentionUser" to={`/${word.substr(1)}`}>
          {word}
        </Link>
      );
    } else if (word[0] === '#') {
      returnedWord = (
        <Link className="linkMentionUser" to={`/hashtags/${word.substr(1)}`}>
          {word}
        </Link>
      );
    } else {
      returnedWord = word;
    }

    return <>{returnedWord} </>;
  });
}

function PostDateTime({ dateTime }) {
  const dateTimeObject = DateTime.fromISO(dateTime).setLocale('pt');
  //return dateTimeObject.toFormat("dd/MM/yyyy 'às' HH:mm")
  return dateTimeObject.toRelative();
}

export default PostsList;
