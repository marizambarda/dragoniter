import React, { useState, useCallback } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import "./CreatePostForm.scss";

function CreatePostForm({loggedUser, defaultText, buttonText}){
  const [postBody, setPostBody] = useState(defaultText);
  const autoFocus = useCallback(el => {
    if (el) {
      el.focus()
      el.setSelectionRange(postBody.length, postBody.length)
    }
  }, [])

  async function formSubmited(e){
    e.preventDefault()
    await axios.post(`http://localhost:9000/posts`, {
      body: postBody
    }, {
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
    window.location.reload();
  }
  return(
    <div className="createPostForm">
      <Form className="clearfix" onSubmit={formSubmited}>
        <Form.Group>
          <Form.Control 
            className="texteareaTimeline"
            as="textarea" 
            ref={autoFocus}
            placeholder={"No que você está pensando, " + (loggedUser ? loggedUser.name : "") + "?"} 
            value={postBody} 
            onChange={e => setPostBody(e.target.value)}
            rows={3} 
          />
        </Form.Group>
        <Button className="buttonSubmitPost" type="submit" variant="primary">{buttonText}</Button>{' '}
      </Form>
    </div>
  )
}

export default CreatePostForm;