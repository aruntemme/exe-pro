const Pet = (props) => {
  return (
    <div>
      <h1>{props.name} </h1>
      <h3>{props.animal} </h3>
      <h3>{props.breed} </h3>
    </div>
  );
};

export default Pet;
