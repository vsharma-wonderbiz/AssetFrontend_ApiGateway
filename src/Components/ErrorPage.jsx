import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const errors = location.state?.errors || [];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Validation Errors
        </h2>

        {errors.length === 0 ? (
          <p className="text-gray-600 text-center">No errors found ✅</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Index</th>
                  <th className="py-3 px-4 text-left">Field</th>
                  <th className="py-3 px-4 text-left">Message</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((err, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-blue-50" : "bg-white"
                    } hover:bg-blue-100 transition`}
                  >
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      {err.index}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{err.field}</td>
                    <td className="py-3 px-4 text-red-600">{err.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
