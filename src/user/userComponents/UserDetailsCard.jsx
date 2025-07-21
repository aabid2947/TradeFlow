import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to format keys into titles
const toTitleCase = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

// Helper component to recursively render data
const DataRenderer = ({ data }) => {
  // Render a table for an array of objects
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const headers = Object.keys(data[0]);
    return (
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {headers.map((header) => <th key={header} scope="col" className="px-4 py-2 font-semibold">{toTitleCase(header)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="bg-white border-b last:border-b-0">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2"><DataRenderer data={row[header]} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Render a list for an array of primitives
  if (Array.isArray(data)) {
    return data.length > 0 ? <p className="text-sm text-gray-600">{data.join(", ")}</p> : <p className="text-sm text-gray-500 italic">No items.</p>;
  }

  // Render key-value pairs for an object
  if (typeof data === 'object' && data !== null) {
    return (
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="grid grid-cols-2 gap-2 text-sm">
            <span className="font-medium text-gray-800">{toTitleCase(key)}</span>
            <div className="text-gray-600 break-words"><DataRenderer data={value} /></div>
          </div>
        ))}
      </div>
    );
  }

  // Render the primitive value itself
  return <span className="text-sm text-gray-600">{String(data)}</span>;
};

// Find the main data object within the API response, ignoring metadata
const findDetailsObject = (data) => {
  if (typeof data !== 'object' || data === null) return null;
  const detailsKey = Object.keys(data).find(key => typeof data[key] === 'object' && data[key] !== null && !['message', 'code'].includes(key.toLowerCase()));
  return detailsKey ? data[detailsKey] : null;
};

export function UserDetailsCard({ result, error }) {
  // Handle API error state
  if (error) {
    return (
      <Card className="shadow-sm border border-red-200 bg-red-50">
        <CardHeader><CardTitle className="text-lg font-semibold text-red-800">Verification Failed</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-red-700">{error.message || "An unknown error occurred."}</p></CardContent>
      </Card>
    );
  }

  // Handle state where there is no result yet, or the verification was not successful
  if (!result || !result.success) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardHeader><CardTitle className="text-lg font-semibold text-gray-900">Result</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-gray-500">{result?.data?.message || "Awaiting verification..."}</p></CardContent>
      </Card>
    );
  }

  const details = findDetailsObject(result.data);

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-lg font-semibold text-gray-900">Verification Result</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-4">
        {details ? (
          <DataRenderer data={details} />
        ) : (
          <p className="text-sm text-gray-500 italic">No displayable data found in the response.</p>
        )}
      </CardContent>
    </Card>
  );
}