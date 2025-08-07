import React from "react";
import TreeNode from "./Treenode";
import "../App.css";

function Menu() {
  const [treeData, setTreeData] = React.useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://localhost:7285/api/asset/Upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg);
      }

      const data = await response.json();
      setTreeData(data);
      console.log("Parsed JSON:", data);
    } catch (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed: " + error.message);
    }
  };

  const handleDownload = () => {
    if (!treeData) {
      alert("No data to download.");
      return;
    }

    const blob = new Blob([JSON.stringify(treeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "treeData.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="menu-container">
      <div className="content">
        {/* Left: Tree View */}
        <div className="left-panel">
          {treeData && treeData.length > 0 && (
            <ul className="tree-view">
              {treeData.map((node) => (
                <TreeNode key={node.id} node={node} />
              ))}
            </ul>
          )}
        </div>

        {/* Right: Upload + Download buttons */}
        <div className="right-panel">
          {/* Styled File Input */}
          <label htmlFor="upload_tree" className="btn">
            Upload File
          </label>
          <input
            type="file"
            accept="application/json, text/plain"
            id="upload_tree"
            className="hidden-input"
            onChange={handleFileChange}
          />

          {/* Download Button */}
          <button className="btn" onClick={handleDownload}>
            Download Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
