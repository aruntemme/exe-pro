import { useState, useEffect, useContext } from 'react';
import Results from './Results';
import ThemeContext from './ThemeContext';

const ANIMALS = ['dog', 'cat', 'bird', 'rabbit', 'reptile'];

const localCache = {};

const SearchParams = () => {
  const [location, setLocation] = useState('');
  const [animal, setAnimal] = useState('');
  const [breed, setBreed] = useState('');
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [theme, setTheme] = useContext(ThemeContext);

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
        <label htmlFor="theme">
          Theme
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onBlur={(e) => setTheme(e.target.value)}
          >
            <option value="peru">Peru</option>
            <option value="darkblue">Dark Blue</option>
            <option value="chartreuse">Chartreuse</option>
            <option value="mediumorchid">Medium Orchid</option>
          </select>
        </label>
        ;<button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
