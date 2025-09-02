
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Edit, Trash2, Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import SignalOverlay from './SignalOverlay';
import {jwtDecode} from "jwt-decode";

const SignalsTable = () => {
  const { assetId } = useParams(); // Get assetId from URL
  const { state: nodeFromState } = useLocation();
  const [signals, setSignals] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [signalToDelete, setSignalToDelete] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [editSignal, setEditSignal] = useState(null);
  const [node, setNode] = useState(nodeFromState || null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role || decoded.userRole);
    }
  }, []);

  // Persist node data in localStorage to handle refresh
  useEffect(() => {
    if (nodeFromState) {
      setNode(nodeFromState);
      setSignals(nodeFromState.signals || []);
      localStorage.setItem('nodeData', JSON.stringify(nodeFromState));
    } else {
      // On refresh, try to load from localStorage
      const storedNode = localStorage.getItem('nodeData');
      if (storedNode) {
        const parsedNode = JSON.parse(storedNode);
        if (parsedNode.id === parseInt(assetId)) {
          setNode(parsedNode);
          setSignals(parsedNode.signals || []);
        }
      }
    }
  }, [nodeFromState, assetId]);

  // Optional: Fetch all signals and filter by assetId (if endpoint exists)
  const fetchSignals = async () => {
    try {
      const response = await fetch('https://localhost:7285/api/Signals');
      if (!response.ok) {
        throw new Error('Failed to fetch signals');
      }
      const data = await response.json();
      // Filter signals by assetId (since no assetId-specific endpoint)
      const filteredSignals = data.filter((signal) => signal.assetId === parseInt(assetId));
      setSignals(filteredSignals);
    } catch (err) {
      toast.error('Failed to load signals');
      console.error('Fetch Error:', err);
    }
  };

  // Uncomment to use fetchSignals if GET /api/Signals exists
  // useEffect(() => {
  //   if (assetId) fetchSignals();
  // }, [assetId]);

  const handleEdit = (signalId) => {
    const signal = signals.find((s) => s.signalId === signalId);
    setEditSignal(signal);
    setShowOverlay(true);
  };

  const handleDelete = async (signalId) => {
    try {
      console.log(`Deleting signal with ID: ${signalId}`);
      const response = await fetch(`https://localhost:7285/api/Signals/${signalId}`, {
        method: 'DELETE',
      });

      console.log('API Response:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(errorText || 'Failed to delete the signal');
      }

      toast.success('Signal deleted successfully');
      setSignals((prevSignals) => prevSignals.filter((s) => s.signalId !== signalId));

      // Update localStorage
      const updatedNode = { ...node, signals: signals.filter((s) => s.signalId !== signalId) };
      setNode(updatedNode);
      localStorage.setItem('nodeData', JSON.stringify(updatedNode));
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setConfirmDelete(false);
      setSignalToDelete(null);
    }
  };

  const handleSignalUpdate = (updatedSignal) => {
    if (editSignal) {
      // Update existing signal
      setSignals((prevSignals) =>
        prevSignals.map((s) => (s.signalId === updatedSignal.signalId ? updatedSignal : s))
      );
    } else {
      // Add new signal
      setSignals((prevSignals) => [...prevSignals, updatedSignal]);
    }
    // Update node and localStorage
    const updatedNode = {
      ...node,
      signals: editSignal
        ? signals.map((s) => (s.signalId === updatedSignal.signalId ? updatedSignal : s))
        : [...signals, updatedSignal],
    };
    setNode(updatedNode);
    localStorage.setItem('nodeData', JSON.stringify(updatedNode));
    setShowOverlay(false);
    setEditSignal(null);
  };

  const getValueTypeColor = (valueType) => {
    switch (valueType?.toLowerCase()) {
      case 'float':
      case 'real':
        return 'bg-blue-100 text-blue-800';
      case 'integer':
      case 'int':
        return 'bg-green-100 text-green-800';
      case 'boolean':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!node) {
    return <div>Error: Asset data not available</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Signals</h1>
        </div>
        <p className="text-lg text-gray-600">
          Asset ID: <span className="font-semibold text-gray-800">{assetId || node.id || 'N/A'}</span>
        </p>
        <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>

        {userRole==="Admin" ? ( <button
          onClick={() => {
            setEditSignal(null);
            setShowOverlay(true);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Signal
        </button>) : (<div></div>)}
        {/* <button
          onClick={() => {
            setEditSignal(null);
            setShowOverlay(true);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Signal
        </button> */}
      </div>

      {/* Table or Empty State */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {signals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Signal ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Signal Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Value Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Description</th>
                  {userRole==="Admin" ? <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>:<div></div>}
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {signals.map((signal, index) => (
                  <tr
                    key={signal.signalId}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                        {signal.signalId}
                      </div>
                    </td>


                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{signal.signalName}</div>
                    </td>


                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getValueTypeColor(signal.valueType)}`}>
                        {signal.valueType}
                      </span>
                    </td>


                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">{signal.description}</div>
                    </td>
                      
                      {userRole==="Admin" ? (<td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(signal.signalId)}
                          className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                          title="Edit Signal"
                        >
                          <Edit className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                        <button
                          onClick={() => {
                            setSignalToDelete(signal.signalId);
                            setConfirmDelete(true);
                          }}
                          className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                          title="Delete Signal"
                        >
                          <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                    </td>):(<div></div>)}

                    {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(signal.signalId)}
                          className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                          title="Edit Signal"
                        >
                          <Edit className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                        <button
                          onClick={() => {
                            setSignalToDelete(signal.signalId);
                            setConfirmDelete(true);
                          }}
                          className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                          title="Delete Signal"
                        >
                          <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                    </td> */}


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50">
            <p className="text-gray-700 text-lg font-semibold mb-2">No Signals Associated with this Asset</p>
            <span className="text-gray-500 text-sm">
              Asset ID: <span className="font-mono">{assetId || node.id || 'N/A'}</span>
            </span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete signal with ID: <strong>{signalToDelete}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button color="error" onClick={() => handleDelete(signalToDelete)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Signal Overlay for Add/Edit */}
      <SignalOverlay
        show={showOverlay}
        node={{ id: assetId || node?.id, name: node?.name || 'Asset' }}
        mode={editSignal ? 'edit' : 'add'}
        signal={editSignal}
        onClose={() => {
          setShowOverlay(false);
          setEditSignal(null);
        }}
        onUpdate={handleSignalUpdate}
      />
    </div>
  );
};

export default SignalsTable;
