import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import "./CreatePostForm.scss";

function CreatePostForm({loggedUser}){
  const [postBody, setPostBody] = useState("");

  async function formSubmited(e){
    e.preventDefault()
    const response = await axios.post(`http://localhost:9000/posts`, {
      body: postBody
    }, {
      headers: {
        access_token: localStorage.getItem("access_token")
      }
    })
    setPostBody("");
    window.location.reload();
  }
  return(
    <div className="createPostForm">
      <Form className="clearfix" onSubmit={formSubmited}>
        <Form.Group>
          <Form.Control 
            className="texteareaTimeline"
            as="textarea" 
            placeholder={"No que você está pensando, " + (loggedUser ? loggedUser.name : "") + " ?"} 
            value={postBody} 
            onChange={e => setPostBody(e.target.value)}
            rows={3} 
          />
        </Form.Group>
        <Button className="buttonSubmitPost" type="submit" variant="primary">Twittar</Button>{' '}
      </Form>
    </div>
  )
}

export default CreatePostForm;