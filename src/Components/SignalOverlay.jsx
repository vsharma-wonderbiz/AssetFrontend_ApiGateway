import React from "react";
import { toast } from "react-toastify";

const SignalOverlay = ({show,node,onClose}) => {
  if (!show || !node) return null; // overlay sirf show state true hone par dikhe

  const [formData, setFormData] = React.useState({
    signalName: "",
    valueType: "",
    description: "",
    assetId: node.id,
  });

  const handleChange=(e)=>{
    const{name,value}=e.target;
    setFormData(prev=>({...prev,[name]:value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    try{
        const response=await fetch("https://localhost:7285/api/Signals",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(formData)
        });
        if(!response.ok) throw new toast.error("Network response was not ok");
        const data=await response.json();
        console.log("Form submitted successfully:", data);
        toast.success("Form submitted successfully!");
    }catch(error){
        toast.error("Error submitting form:" + error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Signal for: {node.name}</h2>

        <form>
          <div className="mb-2">
            <label className="block font-medium">Signal Name:</label>
            <input 
              type="text" 
              name="signalName"
              value={formData.signalName}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded" 
              placeholder="Enter signal name"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Value Type:</label>
            <input 
              type="text" 
              name="valueType"
              value={formData.valueType}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded" 
              placeholder="Enter value type"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Description:</label>
            <textarea 
              className="w-full border px-2 py-1 rounded" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

           <div className="mb-4">
            <label className="block font-medium">Asset Id:</label>
            <input 
              type="text" 
              value={node.id}
              className="w-full border px-2 py-1 rounded" 
              placeholder="Enter value type"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-300 rounded" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSubmit}
             
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignalOverlay;
