import React from "react";
import { useState,useEffect } from "react";
import RenderTree from "./RenderTress";  // Assume RenderTree sahi kaam kar raha hai
import AddForm from "./AddForm";        // Add node form
import DeleteForm from "./DeleteFrom";  // Delete node form
import "../App.css";
import { toast } from 'react-toastify';
import Search from "./Search";

  function Menu() {
    const [treeData, setTreeData] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [stats, setStats] = useState({ totalNodes: 0, maxDepth: 0 });

    // Fetch hierarchy data
    const fetchHierarchy = async () => {
      try {
        const res = await fetch("https://localhost:7285/api/Asset/heirarchy");
        if (!res.ok) throw new Error("Failed to fetch hierarchy");
        const data = await res.json();
        setTreeData(data);
      } catch (err) {
        console.error("Error fetching hierarchy:", err);
      }
    };

    // Fetch stats (total nodes and max depth)
    const fetchStatistics = async () => {
      try {
        const res = await fetch("https://localhost:7285/api/asset/statistics");
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    };

    // Combined success handler
    const onSuccessHandler = async () => {
      await fetchHierarchy();
      await fetchStatistics();
    };

    useEffect(() => {
      // Initial load
      onSuccessHandler();
    }, []);

    // Handle JSON file upload
    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      toast.success("File Uploaded Successfully")
      if (!file) {
        toast.error("File Uploaded Successfully")
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("https://localhost:7285/api/Asset/upload", {
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
        await fetchStatistics();
        alert("Upload successful!");
      } catch (error) {
        console.error("Upload error:", error.message);
        alert("Upload failed: " + error.message);
      }
    };

    // Download treeData as JSON file
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
      <div className="min-h-screen bg-gray-100 font-sans">
        <h1 className="page-heading text-3xl font-bold text-gray-800 text-center pt-6 mb-8">
          Asset Hierarchy
        </h1>

        <Search Data={treeData}/>

        <div className="menu-container container mx-auto px-4 flex flex-col lg:flex-row gap-6">

          {/* Left Panel: Stats + Tree */}
          <div className="left-panel lg:flex-1 bg-white rounded-xl shadow-lg p-6">
            <div className="left-panel-split flex flex-col md:flex-row gap-6">

              {/* Statistics */}
              <div className="statistics-section md:w-1/3 bg-gray-50 rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Statistics</h2>
                {treeData ? (
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Total Nodes:</span>
                      <span className="font-medium">{stats.totalNodes}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Maximum Depth:</span>
                      <span className="font-medium">{stats.maxDepth}</span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-gray-500">No data available for statistics.</p>
                )}
              </div>

              {/* Tree Section */}
              <div className="tree-section md:w-2/3">
                {treeData ? (
                  <RenderTree treeData={treeData} onSuccess={onSuccessHandler} />
                ) : (
                  <p className="text-gray-500">No data uploaded yet.</p>
                )}
              </div>

            </div>
          </div>

          {/* Right Panel: Buttons + Forms */}
          <div className="right-panel lg:w-1/3 bg-white rounded-xl shadow-lg p-6">
            <div className="button-wrapper space-y-4">

              {/* Upload */}
              <label
                htmlFor="upload_tree"
                className="btn block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Upload File
              </label>
              <input
                type="file"
                accept="application/json, text/plain"
                id="upload_tree"
                className="hidden"
                onChange={handleFileChange} />

              {/* Add Node */}
              <button
                className="btn w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                onClick={() => setOpenAdd(!openAdd)}
              >
                Add Node
              </button>
              {openAdd && <AddForm onSuccess={onSuccessHandler} />}

              {/* Delete Node */}
              <button
                className="btn w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                onClick={() => setOpenDelete(!openDelete)}
              >
                Delete Node
              </button>
              {openDelete && <DeleteForm onSuccess={onSuccessHandler}  treeData={treeData} />}

              {/* Download Data */}
              <button
                className="btn w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                onClick={handleDownload}
              >
                Download Data
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

export default Menu;
