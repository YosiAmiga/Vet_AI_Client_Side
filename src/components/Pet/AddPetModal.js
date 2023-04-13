import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

/**
 * This component is a modal that allows the user to add a new pet.
 * @param {*}  
 * @returns {JSX.Element} The AddPetModal component.
 */
const AddPetModal = ({ show, onHide, userEmail, onPetAdded }) => {
  const [petType, setPetType] = useState('');
  const [petName, setPetName] = useState('');
  const [petDob, setPetDob] = useState('');
  const [petTypes, setPetTypes] = useState([]);
  const [petPhoto, setPetPhoto] = useState(null);

  /**
   * Handle form submission.
   * @param {*} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('owner_email', userEmail);
    formData.append('pet_type', petType);
    formData.append('pet_name', petName);
    formData.append('pet_dob', petDob.split('-').reverse().join('/'));
    formData.append('pet_photo', petPhoto);
    try {
        const response = await axios.post('http://localhost:5000/add-new-pet', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
      if (response.data.success) {
        alert('New pet added successfully');
        onHide(); // Close the modal
        onPetAdded();// Trigger pet list update in the PetOwner component
      } else {
        alert('Error adding new pet');
      }
    } catch (error) {
      console.error('Error in addNewPet', error);
      alert('Error in addNewPet');
    }
  };
  

  /**
   * Call initPetTypes when the component mounts
   */
  useEffect(() => {
    initPetTypes();
  }, []);

  /**
   * Initialize pet types from the server.
   */
  const initPetTypes = async () => {
    try {
      const response = await axios.post('http://localhost:5000/get-pet-types');
      setPetTypes(response.data);
    } catch (error) {
      console.error('Error in initPetTypes', error);
      alert('Error in initPetTypes');
    }
  };
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Pet</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
            >
              <option value="">Choose pet type...</option>
              {petTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date of birth</Form.Label>
            <Form.Control
              type="date"
              value={petDob}
              onChange={(e) => setPetDob(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Photo (optional)</Form.Label>
            <Form.Control
                type="file"
                onChange={(e) => setPetPhoto(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Add Pet
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddPetModal;
