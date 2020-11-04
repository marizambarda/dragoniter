import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons' 
import axios from "axios";

function ImageUploadModal({show, handleClose, userFieldName}){

  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState("")

  const imageUpload = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'twitterprojectimages')
    setLoading(true)

    const res = await fetch("https://api.cloudinary.com/v1_1/dw2wdlj0u/image/upload",{
      method: 'POST',
      body: data
    })

    const file = await res.json()
    console.log(file)

    setImage(file.secure_url)
    setLoading(false)

  }

  async function updateUser(){
    try{
      const response = await axios.put(`http://localhost:9000/me`,{
        [userFieldName]: image
      },{
        headers: {
          access_token: localStorage.getItem("access_token")
        }
      })
    } catch (error){
      if (error.response) {
        alert(error.response.data.error)
      } else {
        throw error
      }
    }

    window.location.reload();
  }

  return(
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {userFieldName === "avatar_url" && 'Alterar imagem de perfil'}
          {userFieldName === "cover_url" && 'Alterar imagem da capa'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.File id="exampleFormControlFile1" label="Selecionar imagem" onChange={imageUpload}/>
          </Form.Group>
          {
            loading?(
              <h5>Carregando imagem...</h5>
            ):(
              <img src={image} className="imageErrorUpload"/>
            )
          }
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={updateUser} disabled={ !image }>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ImageUploadModal;