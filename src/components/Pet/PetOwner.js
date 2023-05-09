import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetCard from './PetCard';
import AddPetModal from './AddPetModal';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { SERVER_IP } from '../App';
import Plot from 'react-plotly.js';

/**
 * This component is the pet owner page.
 * @param {*} param0 
 * @returns {JSX.Element} The PetOwner component.
 */
const PetOwner = ({ onLogout, userEmail }) => {
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [petsList, setPetsList] = useState([]);
  const petName = "This is the pet name";
  /**
   * Initialize the owner's pets.
   */
  const initOwnerPets = async () => {
    try {
      const response = await axios.post(SERVER_IP + ':5000/get-user-pets', { userEmail });
      console.log('response', response.data);
      const petsList = response.data.map((petData) => ({
        pet_id: petData.pet_id,
        ownerEmail: petData.ownerEmail,
        type: petData.type,
        name: petData.name,
        dob: petData.dob,
        image: petData.image,
      }));
      setPetsList(petsList);
    } catch (error) {
      console.error('Error in initOwnerPets', error);
      alert('Error in initOwnerPets');
    }
  };

  /**
   * Call initOwnerPets when the component mounts
   */
  useEffect(() => {
    initOwnerPets();
  }, []);

  /**
   * Callback function to update the pet list after a new pet is added.
   */
  const onPetAdded = () => {
    initOwnerPets();
  };

  console.log("Pet name in PetOwner:", petName);

  return (
    <div className="vertical-buttons">
      <h2>Pet Owner Page</h2>
      <p>Welcome, {userEmail}</p>
      <div className="pet-list">
        {petsList.map((pet) => (
          <PetCard key={pet.pet_id} pet={pet}>
            <Link to={`/image-upload`} state={pet}>
              <Button>Go to Image Upload</Button>
            </Link>
          </PetCard>
        ))}
        <Button onClick={() => setShowAddPetModal(true)}>Add New Pet</Button>
      </div>
      <button className="Logout-button" onClick={onLogout}>
        Logout
      </button>
      <AddPetModal
        show={showAddPetModal}
        onHide={() => setShowAddPetModal(false)}
        userEmail={userEmail}
        onPetAdded={onPetAdded}
      />
    </div>
  );
  
};

export default PetOwner;
