import React from "react";

const SignalOverlay = () => {
//   if (!show || !node) return null; // overlay sirf show state true hone par dikhe

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Signal for</h2>
        
        <form>
          <div className="mb-2">
            <label className="block font-medium">Signal Name:</label>
            <input 
              type="text" 
              className="w-full border px-2 py-1 rounded" 
              placeholder="Enter signal name"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Value Type:</label>
            <input 
              type="text" 
              className="w-full border px-2 py-1 rounded" 
              placeholder="Enter value type"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Description:</label>
            <textarea 
              className="w-full border px-2 py-1 rounded" 
              placeholder="Enter description"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-300 rounded" 
            //   onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded"
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
