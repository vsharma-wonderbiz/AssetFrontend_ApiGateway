import { useState } from "react";

export default function Dragging() {
  const [dropped, setDropped] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDropped(true);
    alert("Item dropped! 🎉"); // your event trigger
  };

  return (
    <div className="p-10">
      {/* Draggable item */}
      <div
        draggable
        onDragStart={(e) => e.dataTransfer.setData("text", "drag-item")}
        className="w-24 h-24 bg-blue-500 text-white flex items-center justify-center cursor-move"
      >
        Drag me
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mt-10 w-64 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center"
      >
        {dropped ? "✅ Dropped!" : "Drop here"}
      </div>
    </div>
  );
}
