import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../api';
import LoadingIndicator from '../../components/LoadingIndicator';
import './ImageUploadModal.scss';

function ImageUploadModal({ show, handleClose, userFieldName }) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState('');

  const imageUpload = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'twitterprojectimages');
    setIsLoading(true);

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dw2wdlj0u/image/upload',
      {
        method: 'POST',
        body: data,
      }
    );

    const file = await res.json();
    console.log(file);

    setImage(file.secure_url);
    setIsLoading(false);
  };

  async function updateUser() {
    const response = await api.put(`/me`, { [userFieldName]: image });

    if (response.ok) {
      window.location.reload();
    } else {
      alert(response.data.error);
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {userFieldName === 'avatar_url' && 'Alterar imagem de perfil'}
          {userFieldName === 'cover_url' && 'Alterar imagem da capa'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="chageImages">
        <Form>
          <Form.Group>
            <Form.File
              id="exampleFormControlFile1"
              label="Selecionar imagem"
              onChange={imageUpload}
            />
          </Form.Group>
          {isLoading && <LoadingIndicator />}
          {!isLoading && <img src={image} className="imageErrorUpload" />}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={updateUser} disabled={!image}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ImageUploadModal;
