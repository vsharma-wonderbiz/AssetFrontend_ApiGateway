import React, { useState, useEffect, use } from "react";
import { Upload, Plus, Trash2, Download, Search, BarChart3, FolderTree, Activity } from "lucide-react";
import AddForm from "./AddForm";
import RenderTress from "./RenderTress";
import Search2 from "./Search2";
import SignalOverlay from "./SignalOverlay";

// File Upload Component
const FileUpload = ({ onFileChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const mockEvent = { target: { files: e.dataTransfer.files } };
      onFileChange(mockEvent);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileChange(e);
    }
  };

  return (
    <div className="mb-6">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("upload_tree").click()}
      >
        <input
          type="file"
          accept="application/json, text/plain"
          id="upload_tree"
          className="hidden"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full transition-colors ${dragActive ? "bg-blue-100" : "bg-gray-100"}`}>
            <Upload className={`w-8 h-8 ${dragActive ? "text-blue-600" : "text-gray-600"}`} />
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {dragActive ? "Drop your file here" : "Upload Asset Hierarchy"}
            </p>
            <p className="text-gray-500 text-sm">Drag and drop your JSON file here, or click to browse</p>
            <p className="text-gray-400 text-xs mt-1">Supports: JSON, TXT files</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div
    className={`bg-gradient-to-br ${color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

function Menu1() {
  const [treeData, setTreeData] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [stats, setStats] = useState({ totalNodes: 0, maxDepth: 0 });
  const [SearchTerm, SetSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOverlay,setShowOverlay]=useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    fetchHierarchy();
    fetchStatistics();
  }, []);

  const fetchHierarchy = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7285/api/Asset/heirarchy");
      if (!res.ok) throw new Error("Failed to fetch hierarchy");
      const data = await res.json();
      setTreeData(data);
    } catch (err) {
      console.error("Error fetching hierarchy:", err);
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await fetch("https://localhost:7285/api/Asset/statistics");
      if (!res.ok) throw new Error("Failed to fetch statistics");
      const data = await res.json();
      setStats({ totalNodes: data.totalNodes, maxDepth: data.maxDepth });
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setStats({ totalNodes: 0, maxDepth: 0 });
    }
  };

  const onSuccessHandler = async () => {
    await fetchHierarchy();
    await fetchStatistics();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://localhost:7285/api/Asset/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      alert("File uploaded successfully!");
      onSuccessHandler(); // Refresh hierarchy and stats
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload file");
    }
  };

  const handleDownload = () => {
    if (!treeData) {
      alert("No data to download.");
      return;
    }
    const blob = new Blob([JSON.stringify(treeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "treeData.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filterTree = (nodes, keyword) => {
    if (!keyword) return nodes;
    return nodes
      .map((node) => {
        const children = node.children ? filterTree(node.children, keyword) : ["No data Found"];
        
        if (node.name.toLowerCase().includes(keyword.toLowerCase()) || children.length) {
          return { ...node, children };
        }
        return null;
      })
      .filter(Boolean);
  };

  console.log("Selected Node in Menu1:", selectedNode);
  console.log("Show Overlay in Menu1:", showOverlay);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FolderTree className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Asset Hierarchy</h1>
                <p className="text-gray-600 text-sm">Manage and visualize your asset structure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="w-4 h-4" />
              <span>Live Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard icon={BarChart3} title="Total Nodes" value={stats.totalNodes} color="from-blue-500 to-blue-600" />
          <StatCard icon={FolderTree} title="Maximum Depth" value={stats.maxDepth} color="from-emerald-500 to-emerald-600" />
          
        </div>

        {/* Search */}
        <Search2 SearchTerm={SearchTerm} SetSearchTerm={SetSearchTerm} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tree Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FolderTree className="w-5 h-5 mr-2 text-blue-600" />
                  Hierarchy Visualization
                </h2>
                <p className="text-gray-600 text-sm mt-1">Interactive tree view of your assets</p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : treeData.length > 0 ? (
                  <RenderTress treeData={filterTree(treeData, SearchTerm)} onSuccess={onSuccessHandler} SearchTerm={SearchTerm}
                   setShowOverlay={setShowOverlay} setSelectedNode={setSelectedNode}
                   />
                ) : (
                  <div className="text-center py-12">
                    <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hierarchy data available</p>
                    <p className="text-gray-400 text-sm">Upload a file to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Controls */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                File Management
              </h3>
              <FileUpload onFileChange={handleFileChange} />

              <button
                onClick={handleDownload}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download Data</span>
              </button>
            </div>

            {/* Node Operations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Operations</h3>

              <div className="space-y-3">
                <button
                  onClick={() => setOpenAdd(!openAdd)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Node</span>
                </button>

                <button
                  onClick={() => setOpenDelete(!openDelete)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Node</span>
                </button>
              </div>

              {openAdd && <AddForm onSuccess={onSuccessHandler} />}
              {openDelete && <DeleteForm onSuccess={onSuccessHandler} treeData={treeData} />}
            </div>
          </div>
        </div>
      </div>
      <SignalOverlay show={showOverlay} node={selectedNode} onClose={()=>setShowOverlay(false)}/> 
    </div>
  );
}

export default Menu1;
