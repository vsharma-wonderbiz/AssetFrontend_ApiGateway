
import React from "react";
import RenderTree from "./RenderTress";
import AddForm from "./AddForm";
import "../App.css";
import DeleteForm from "./DeleteFrom";

function Menu() {
  const [treeData, setTreeData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [opend, setOpend] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickd = () => {
    setOpend(!opend);
  };

  // Fetch hierarchy from backend API
  const fetchHierarchy = async () => {
    try {
      const res = await fetch("https://localhost:7285/api/asset/hierarchy");
      if (!res.ok) throw new Error("Failed to fetch hierarchy");
      const data = await res.json();
      setTreeData(data);
    } catch (err) {
      console.error("Error fetching hierarchy:", err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://localhost:7285/api/asset/upload", {
        method: "POST",
        body: formData,
        mode: "cors",
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
    <>
      <h1 className="page-heading">Asset Hierarchy</h1>
      <div className="menu-container">
        {/* LEFT PANEL - Tree */}
        <div className="left-panel">
          {treeData ? (
            <RenderTree treeData={treeData} />
          ) : (
            <p>No data uploaded yet.</p>
          )}
        </div>

        {/* RIGHT PANEL - Buttons */}
        <div className="right-panel">
          <div className="button-wrapper">
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

            <button className="btn" onClick={handleClick}>
              Add Node
            </button>
            {open ? <AddForm onSuccess={fetchHierarchy} /> : ""}

            <button
              className="btn"
              onClick={handleClickd}
            >
              Delete Node
            </button>
            {opend ? <DeleteForm onSuccess={fetchHierarchy} /> : ""}

            <button className="btn" onClick={handleDownload}>
              Download Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;

