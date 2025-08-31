import React from "react";
import { useState } from "react";

const ContextMenu = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <ComponentA setShow={setShow} />
      {show && <ComponentB />}
    </div>
  );
};

const ComponentA = ({ setShow }) => {
  return <button onClick={() => setShow(true)}>Show B</button>;
};



const ComponentB = () => {
  return <div>I am Component B!</div>;
};

export default ContextMenu;
