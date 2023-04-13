import React, { useState } from 'react';
import { Card, Button, Modal, Tab, Tabs } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * PetCard component displays pet information in a card with personal data and history tabs.
 * @param {Object} pet - The pet object containing the pet's information.
 * @returns {JSX.Element} PetCard component.
 */
const PetCard = ({ pet, children }) => {
    const [modalShow, setModalShow] = useState(false);
  
    return (
      <>
        <div className="pet-card-wrapper">
          <Card onClick={() => setModalShow(true)}>
            <Card.Img variant="top" src={pet.image} />
            <Card.Body>
              <Card.Title>{pet.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{pet.type}</Card.Subtitle>
            </Card.Body>
          </Card>
        </div>
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{pet.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs defaultActiveKey="personalData" id="pet-tabs">
              <Tab eventKey="personalData" title="Personal Data">
                <p>Type: {pet.type}</p>
                <p>Date of Birth: {pet.dob}</p>
                <p>Owner Email: {pet.ownerEmail}</p>
              </Tab>
              <Tab eventKey="history" title="History">
                <p>Pet history will be displayed here.</p>
              </Tab>
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Close
            </Button>
            {children}
          </Modal.Footer>
        </Modal>
      </>
    );
    
  };
  
  PetCard.propTypes = {
    pet: PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      dob: PropTypes.string.isRequired,
      ownerEmail: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.node,
  };
  
  export default PetCard;
