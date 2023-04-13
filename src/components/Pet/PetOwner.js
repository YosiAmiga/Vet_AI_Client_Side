import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetCard from './PetCard';
import AddPetModal from './AddPetModal';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

/**
 * This component is the pet owner page.
 * @param {*} param0 
 * @returns {JSX.Element} The PetOwner component.
 */
const PetOwner = ({ onLogout, userEmail }) => {
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [petsList, setPetsList] = useState([]);

  /**
   * Initialize the owner's pets.
   */
  const initOwnerPets = async () => {
    try {
      const response = await axios.post('http://localhost:5000/get-user-pets', { userEmail });
      console.log('response', response.data);
      const petsList = response.data.map((petData) => ({
        pet_id: petData[0],
        ownerEmail: petData[1],
        type: petData[2],
        name: petData[3],
        dob: petData[4],
        image: 'https://via.placeholder.com/150',
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

  
  return (
    <div className="vertical-buttons">
      <h2>Pet Owner Page</h2>
      <p>Welcome, {userEmail}</p>
      <div className="pet-list">
        {petsList.map((pet) => (
          <PetCard key={pet.pet_id} pet={pet}>
            <Link to={`/image-upload`}>
              <button>Go to Image Upload</button>
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
