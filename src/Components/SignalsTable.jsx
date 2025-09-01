import React from 'react';
import { Edit, Trash2, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SignalsTable = () => {
    const {state:node}=useLocation();
    console.log(node)
  // Dummy data - replace with API data later
//   const dummySignals = [
//     {
//       id: 'SIG_001',
//       name: 'Temperature Sensor',
//       valueType: 'Float',
//       description: 'Monitors ambient temperature in degrees Celsius'
//     },
//     {
//       id: 'SIG_002',
//       name: 'Pressure Gauge',
//       valueType: 'Integer',
//       description: 'Measures system pressure in PSI'
//     },
//     {
//       id: 'SIG_003',
//       name: 'Status Indicator',
//       valueType: 'Boolean',
//       description: 'Shows operational status (ON/OFF)'
//     },
//     {
//       id: 'SIG_004',
//       name: 'Flow Rate Monitor',
//       valueType: 'Float',
//       description: 'Tracks fluid flow rate in liters per minute'
//     },
//     {
//       id: 'SIG_005',
//       name: 'Vibration Sensor',
//       valueType: 'Float',
//       description: 'Detects mechanical vibrations in Hz'
//     },
//     {
//       id: 'SIG_006',
//       name: 'Vibration Sensor',
//       valueType: 'Float',
//       description: 'Detects mechanical vibrations in Hz'
//     }
//   ];
 if (!node.signals || node.signals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-md p-6">
        <p className="text-gray-700 text-lg font-semibold mb-2">
          No Signals Found
        </p>
        <span className="text-gray-500 text-sm">
          for the Asset ID: <span className="font-mono">{node.id}</span>
        </span>
      </div>
    );
  }
  const assetId = 'ASSET_12345'; // This would come from props or context

  const handleEdit = (signalId) => {
    console.log(`Edit signal: ${signalId}`);
    // Add edit functionality here
  };

  const handleDelete = (signalId) => {
    console.log(`Delete signal: ${signalId}`);
    // Add delete functionality here
  };

  const getValueTypeColor = (valueType) => {
    switch (valueType.toLowerCase()) {
      case 'float':
        return 'bg-blue-100 text-blue-800';
      case 'integer':
        return 'bg-green-100 text-green-800';
      case 'boolean':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Signals</h1>
        </div>
        <p className="text-lg text-gray-600">Asset ID: <span className="font-semibold text-gray-800">{node.id}</span></p>
        <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Signal ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Signal Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Value Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {node.signals.map((signal, index) => (
                <tr 
                  key={signal.id} 
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
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
                    <div className="text-sm text-gray-700 max-w-xs">
                      {signal.description}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleEdit(signal.id)}
                        className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                        title="Edit Signal"
                      >
                        <Edit className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(signal.id)}
                        className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        title="Delete Signal"
                      >
                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {/* <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{dummySignals.length}</span> signals
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SignalsTable;