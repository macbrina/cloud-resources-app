"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_CLOUD_RESOURCES, RESOURCE_UPDATED } from "../graphql/queries";
import debounce from "lodash.debounce";

export default function Home() {
  const [filter, setFilter] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_CLOUD_RESOURCES, {
    variables: { filter, type, status },
  });
  const searchInputRef = useRef(null);

  useSubscription(RESOURCE_UPDATED, {
    onData: ({ data }) => {
      try {
        console.log("Received updated resource:", data.resourceUpdated);
        refetch();
      } catch (error) {
        console.error("Error refetching resources:", error);
      }
    },
  });

  // Debounce the refetch function to avoid refetching on every keystroke
  const debouncedRefetch = useCallback(
    debounce((newFilter) => {
      refetch({ filter: newFilter, type, status });
    }, 300),
    [type, status]
  );

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    debouncedRefetch(e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    refetch({ filter, type: e.target.value, status });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    refetch({ filter, type, status: e.target.value });
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedRefetch.cancel();
    };
  }, [debouncedRefetch]);

  useEffect(() => {
    const focusInput = () => {
      if (searchInputRef.current || data) {
        searchInputRef.current.focus();
      }
    };

    // Adding a small delay to ensure focus
    setTimeout(focusInput, 100);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="h-dvh flex justify-center items-center py-8">
      <div className="relative overflow-x-auto w-full max-w-4xl px-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Cloud Resources</h2>
          <div className="flex items-center gap-2">
            <select
              value={type}
              onChange={handleTypeChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="VM">VM</option>
              <option value="Database">Database</option>
              <option value="Storage">Storage</option>
            </select>
            <select
              value={status}
              onChange={handleStatusChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search resources..."
              value={filter}
              onChange={handleFilterChange}
              className="ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>
        <div className="overflow-y-auto max-h-[500px] p-4">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.cloudResources.length > 0 ? (
                data?.cloudResources.map((resource) => (
                  <tr
                    key={resource.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {resource.name}
                    </th>
                    <td className="px-6 py-4">{resource.type}</td>
                    <td className="px-6 py-4">{resource.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No Resources Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
