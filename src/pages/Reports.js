import React from 'react'
import isAuth from '../../components/isAuth';

function Reports() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Reports</h1>
        <p className="text-lg text-gray-300">No Reports available.</p>
      </div>
    </div>
  );
}
export default isAuth(Reports);