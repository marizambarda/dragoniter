import React, { useState, useCallback } from "react";
import api from "../../api";
import { Form, Button } from "react-bootstrap";
import { useAppContext} from "../../AppContext";
import "./CreatePostForm.scss";


function CreatePostForm({ defaultText, buttonText}){
  const {loggedUser} = useAppContext()
  const [postBody, setPostBody] = useState(defaultText)
  const [isLoading, setIsLoading] = useState(false)

  const autoFocus = useCallback(el => {
    if (el) {
      el.focus()
      el.setSelectionRange(postBody.length, postBody.length)
    }
  }, [])

  async function formSubmited(e){
    e.preventDefault()
    setIsLoading(true)
    await api.post(`/posts`, { body: postBody })
    window.location.reload();
    setIsLoading(false)
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
        <Button
          className="buttonSubmitPost"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : buttonText}
        </Button>
      </Form>
    </div>
  )
}

export default CreatePostForm;