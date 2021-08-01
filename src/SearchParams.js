import { useState, useEffect } from 'react';
import Results from './Results';

const ANIMALS = ['dog', 'cat', 'bird', 'rabbit', 'reptile'];

const localCache = {};

const SearchParams = () => {
  const [location, setLocation] = useState('');
  const [animal, setAnimal] = useState('');
  const [breed, setBreed] = useState('');
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    requestPets();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  async function requestPets() {
    const res = await fetch(
      `http://pets-v2.dev-apis.com/pets?animal=${animal}&location=${location}&breed=${breed}`
    );
    const json = await res.json();
    setPets(json.pets);
  }
  useEffect(() => {
    requestBreeds();
    async function requestBreeds() {
      if (!animal) {
        setBreeds([]);
      } else if (localCache[animal]) {
        setBreeds(localCache[animal]);
      } else {
        requestBreedList();
      }

      async function requestBreedList() {
        setBreeds([]);
        const res = await fetch(
          `http://pets-v2.dev-apis.com/breeds?animal=${animal}`
        );

        const json = await res.json();
        localCache[animal] = json.breeds || [];
        setBreeds(localCache[animal]);
      }
    }
  }, [animal]);

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestPets();
        }}
      >
        <label htmlFor="location">
          Location
          <input
            id="location"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            placeholder="Location"
          />
        </label>
        <label htmlFor="animalDropdown">
          Animal
          <select
            value={animal}
            id="animalDropdown"
            onChange={(e) => setAnimal(e.target.value)}
            onBlur={(e) => setAnimal(e.target.value)}
          >
            <option></option>
            {ANIMALS.map((animal) => (
              <option value={animal} key={animal}>
                {animal}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="breedlDropdown">
          Breed
          <select
            value={breed}
            id="breedDropdown"
            onChange={(e) => setBreed(e.target.value)}
            onBlur={(e) => setBreed(e.target.value)}
          >
            <option></option>
            {breeds.map((breed) => (
              <option value={breed} key={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>
        <button>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
