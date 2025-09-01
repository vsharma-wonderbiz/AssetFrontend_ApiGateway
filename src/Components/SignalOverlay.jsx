  // import React from "react";
  // import { toast } from "react-toastify";

  // const SignalOverlay = ({show,node,onClose}) => {
  //   if (!show || !node) return null; // overlay sirf show state true hone par dikhe

  //   const [formData, setFormData] = React.useState({
  //     signalName: "",
  //     valueType: "",
  //     description: "",
  //     assetId: node.id,
  //   });

  //   const handleChange=(e)=>{
  //     const{name,value}=e.target;
  //     setFormData(prev=>({...prev,[name]:value}));
  //   }

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     // Handle form submission
  //     try{
  //         const response=await fetch("https://localhost:7285/api/Signals",{
  //             method:"POST",
  //             headers:{
  //                 "Content-Type":"application/json"
  //             },
  //             body:JSON.stringify(formData)
  //         });
  //         if(!response.ok) throw new toast.error("Network response was not ok");
  //         const data=await response.json();
  //         console.log("Form submitted successfully:", data);
  //         toast.success("Form submitted successfully!");
  //     }catch(error){
  //         toast.error("Error submitting form:" + error);
  //     }

  //     onClose();
  //   };

  //   return (
  //     <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex items-center justify-center z-50">
  //       <div className="bg-white rounded-lg p-6 w-1/2 shadow-lg">
  //         <h2 className="text-xl font-bold mb-4">Add Signal for: {node.name}</h2>

  //         <form>
  //           <div className="mb-2">
  //             <label className="block font-medium">Signal Name:</label>
  //             <input 
  //               type="text" 
  //               name="signalName"
  //               value={formData.signalName}
  //               onChange={handleChange}
  //               className="w-full border px-2 py-1 rounded" 
  //               placeholder="Enter signal name"
  //             />
  //           </div>

  //           <div className="mb-2">
  //             <label className="block font-medium">Value Type:</label>
  //             <input 
  //               type="text" 
  //               name="valueType"
  //               value={formData.valueType}
  //               onChange={handleChange}
  //               className="w-full border px-2 py-1 rounded" 
  //               placeholder="Enter value type"
  //             />
  //           </div>

  //           <div className="mb-4">
  //             <label className="block font-medium">Description:</label>
  //             <textarea 
  //               className="w-full border px-2 py-1 rounded" 
  //               name="description"
  //               value={formData.description}
  //               onChange={handleChange}
  //               placeholder="Enter description"
  //             />
  //           </div>

  //           <div className="mb-4">
  //             <label className="block font-medium">Asset Id:</label>
  //             <input 
  //               type="text" 
  //               value={node.id}
  //               className="w-full border px-2 py-1 rounded" 
  //               placeholder="Enter value type"
  //             />
  //           </div>

  //           <div className="flex justify-end space-x-2">
  //             <button 
  //               type="button" 
  //               className="px-4 py-2 bg-gray-300 rounded" 
  //               onClick={onClose}
  //             >
  //               Cancel
  //             </button>
  //             <button 
  //               type="submit" 
  //               className="px-4 py-2 bg-blue-500 text-white rounded"
  //               onClick={handleSubmit}
              
  //             >
  //               Add
  //             </button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // };

  // export default SignalOverlay;






//   import React from "react";
// import { toast } from "react-toastify";

// const SignalOverlay = ({ show, node, onClose }) => {
//   if (!show || !node) return null;

//   const [formData, setFormData] = React.useState({
//     signalName: "",
//     valueType: "",
//     description: "",
//     assetId: node.id,
//   });

//   const [errors, setErrors] = React.useState({});
//   const [isSubmitting, setIsSubmitting] = React.useState(false);

//   const validateForm = () => {
//     const newErrors = {};
//     let isValid = true;

//     // Validate Signal Name
//     if (formData.signalName === "") {
//       newErrors.signalName = 'Signal Name cannot be empty';
//       isValid = false;
//     } else if (!/^[a-zA-Z\s]*$/.test(formData.signalName)) {
//       newErrors.signalName = 'Signal Name can only contain letters and spaces';
//       isValid = false;
//     } else if (formData.signalName.trim().length < 3) {
//       newErrors.signalName = 'Signal Name must be at least 3 characters long';
//       isValid = false;
//     } else if (formData.signalName.trim().length > 50) {
//       newErrors.signalName = 'Signal Name must not exceed 50 characters';
//       isValid = false;
//     }

//     // Validate Value Type
//     if (formData.valueType === "") {
//       newErrors.valueType = 'Value Type cannot be empty';
//       isValid = false;
//     } else if (!["int", "real"].includes(formData.valueType)) {
//       newErrors.valueType = 'Value Type must be exactly "int" or "real"';
//       isValid = false;
//     }

//     // Validate Description
//     if (formData.description === "") {
//       newErrors.description = 'Description cannot be empty';
//       isValid = false;
//     } else if (!/^[a-zA-Z0-9\s.,_-]*$/.test(formData.description)) {
//       newErrors.description = 'Description can only contain letters, numbers, spaces, and basic punctuation (. , - _)';
//       isValid = false;
//     } else if (formData.description.trim().length < 5) {
//       newErrors.description = 'Description must be at least 5 characters long';
//       isValid = false;
//     } else if (formData.description.trim().length > 200) {
//       newErrors.description = 'Description must not exceed 200 characters';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear specific field error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Run validation
//     if (!validateForm()) {
//       console.log("Validation failed:", errors);
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       const response = await fetch("https://localhost:7285/api/Signals", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           ...formData,
//           signalName: formData.signalName.trim(),
//           description: formData.description.trim()
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
      
//       const data = await response.json();
//       console.log("Form submitted successfully:", data);
//       toast.S("Signal added successfully!");
      
//       // Reset form
//       setFormData({
//         signalName: "",
//         valueType: "",
//         description: "",
//         assetId: node.id,
//       });
//       setErrors({});
//       onClose();
      
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Error submitting form: " + error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-1/2 shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Add Signal for: {node.name}</h2>

//         <div>
//           <div className="mb-2">
//             <label className="block font-medium">Signal Name:</label>
//             <input
//               type="text"
//               name="signalName"
//               value={formData.signalName}
//               onChange={handleChange}
//               className={`w-full border px-2 py-1 rounded ${errors.signalName ? 'border-red-500' : ''}`}
//               placeholder="Enter signal name"
//               disabled={isSubmitting}
//             />
//             {errors.signalName && (
//               <div className="text-red-500 text-sm mt-1">{errors.signalName}</div>
//             )}
//           </div>

//           <div className="mb-2">
//             <label className="block font-medium">Value Type:</label>
//             <select
//               name="valueType"
//               value={formData.valueType}
//               onChange={handleChange}
//               className={`w-full border px-2 py-1 rounded ${errors.valueType ? 'border-red-500' : ''}`}
//               disabled={isSubmitting}
//             >
//               <option value="">Select value type</option>
//               <option value="int">int</option>
//               <option value="real">real</option>
//             </select>
//             {errors.valueType && (
//               <div className="text-red-500 text-sm mt-1">{errors.valueType}</div>
//             )}
//             <div className="text-gray-500 text-xs mt-1">
//               Choose 'int' for whole numbers or 'real' for decimal numbers
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block font-medium">Description (Optional):</label>
//             <textarea
//               className={`w-full border px-2 py-1 rounded ${errors.description ? 'border-red-500' : ''}`}
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Enter description (optional)"
//               disabled={isSubmitting}
//               rows="3"
//             />
//             {errors.description && (
//               <div className="text-red-500 text-sm mt-1">{errors.description}</div>
//             )}
//             <div className="text-gray-500 text-xs mt-1">
//               {formData.description.length}/200 characters
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block font-medium">Asset Id:</label>
//             <input
//               type="text"
//               value={node.id}
//               className="w-full border px-2 py-1 rounded bg-gray-100"
//               placeholder="Asset ID"
//               disabled
//             />
//           </div>

//           <div className="flex justify-end space-x-2">
//             <button
//               type="button"
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
//               onClick={onClose}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               className={`px-4 py-2 rounded text-white transition-colors ${
//                 isSubmitting 
//                   ? 'bg-blue-400 cursor-not-allowed' 
//                   : 'bg-blue-500 hover:bg-blue-600'
//               }`}
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Adding...' : 'Add'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignalOverlay;

  

import React from "react";
import { toast } from "react-toastify";

const SignalOverlay = ({ show, node, onClose, mode = "add", signal = null, onUpdate }) => {
  if (!show || !node) return null;

  const [formData, setFormData] = React.useState({
    signalName: "",
    valueType: "",
    description: "",
    assetId: node.id,
  });

  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // ✅ Prefill data in edit mode
  React.useEffect(() => {
    if (mode === "edit" && signal) {
      setFormData({
        signalName: signal.signalName || "",
        valueType: signal.valueType || "",
        description: signal.description || "",
        assetId: node.id,
      });
    } else {
      setFormData({
        signalName: "",
        valueType: "",
        description: "",
        assetId: node.id,
      });
    }
  }, [mode, signal, node.id]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (formData.signalName === "") {
      newErrors.signalName = 'Signal Name cannot be empty';
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(formData.signalName)) {
      newErrors.signalName = 'Signal Name can only contain letters and spaces';
      isValid = false;
    } else if (formData.signalName.trim().length < 3) {
      newErrors.signalName = 'Signal Name must be at least 3 characters long';
      isValid = false;
    } else if (formData.signalName.trim().length > 50) {
      newErrors.signalName = 'Signal Name must not exceed 50 characters';
      isValid = false;
    }

    if (formData.valueType === "") {
      newErrors.valueType = 'Value Type cannot be empty';
      isValid = false;
    } else if (!["int", "real"].includes(formData.valueType)) {
      newErrors.valueType = 'Value Type must be exactly "int" or "real"';
      isValid = false;
    }

    if (formData.description === "") {
      newErrors.description = 'Description cannot be empty';
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s.,_-]*$/.test(formData.description)) {
      newErrors.description = 'Description can only contain letters, numbers, spaces, and basic punctuation (. , - _)';
      isValid = false;
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters long';
      isValid = false;
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must not exceed 200 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const url =
        mode === "edit"
          ? `https://localhost:7285/api/Signals/${signal.signalId}`
          : "https://localhost:7285/api/Signals";

      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          signalName: formData.signalName.trim(),
          description: formData.description.trim(),
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (mode === "edit") {
        toast.success("Signal updated successfully!");
        if (onUpdate) onUpdate(data);
      } else {
        toast.success("Signal added successfully!");
        if (onUpdate) onUpdate(data);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error: the signal already exists in asset" );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? `Edit Signal: ${signal?.signalId}` : `Add Signal for: ${node.name}`}
        </h2>

        {/* Signal Name */}
        <div className="mb-2">
          <label className="block font-medium">Signal Name:</label>
          <input
            type="text"
            name="signalName"
            value={formData.signalName}
            onChange={handleChange}
            className={`w-full border px-2 py-1 rounded ${errors.signalName ? 'border-red-500' : ''}`}
            placeholder="Enter signal name"
            disabled={isSubmitting}
          />
          {errors.signalName && <div className="text-red-500 text-sm mt-1">{errors.signalName}</div>}
        </div>

        {/* Value Type */}
        <div className="mb-2">
          <label className="block font-medium">Value Type:</label>
          <select
            name="valueType"
            value={formData.valueType}
            onChange={handleChange}
            className={`w-full border px-2 py-1 rounded ${errors.valueType ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select value type</option>
            <option value="int">int</option>
            <option value="real">real</option>
          </select>
          {errors.valueType && <div className="text-red-500 text-sm mt-1">{errors.valueType}</div>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium">Description:</label>
          <textarea
            className={`w-full border px-2 py-1 rounded ${errors.description ? 'border-red-500' : ''}`}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            disabled={isSubmitting}
            rows="3"
          />
          {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
        </div>

        {/* Asset ID */}
        <div className="mb-4">
          <label className="block font-medium">Asset Id:</label>
          <input
            type="text"
            value={node.id}
            className="w-full border px-2 py-1 rounded bg-gray-100"
            disabled
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded text-white transition-colors ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "edit" ? "Updating..." : "Adding..."
              : mode === "edit" ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignalOverlay;



