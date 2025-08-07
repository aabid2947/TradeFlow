import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin border-t-blue-500 shadow-lg"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-300 opacity-20"></div>
        </div>
        
        {/* Loading text with pulse animation */}
        <div className="text-center">
          {/* <p className="text-slate-700 font-medium text-lg animate-pulse">
            Authenticating
          </p> */}
          {/* <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Loader;