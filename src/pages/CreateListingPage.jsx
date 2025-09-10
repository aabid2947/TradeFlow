import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {SiteHeader} from '../components/SiteHeader'
import Footer from '../components/Footer'
import CreateListingForm from '../components/CreateListingForm'

const CreateListingPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login',user)
    return <Navigate to="/login" replace />
  }

  // Redirect if user is not a seller
  // if (user?.role !== 'seller') {
  //   return <Navigate to="/dashboard" replace />
  // }

  return (
    <>
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* <div className="text-center mb-8 relative group">
            <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white backdrop-blur border border-zinc-200 rounded-2xl p-8 hover:border-zinc-300 transition-all duration-300 shadow-md shadow-zinc-300/50 hover:shadow-lg hover:shadow-zinc-400/60">
              <h1 className="text-4xl font-bold text-zinc-900 mb-4">
                Create New Listing
              </h1>
              <p className="text-zinc-600 text-lg">
                List your FUN tokens for sale and start earning
              </p>
            </div>
          </div> */}
          
          <CreateListingForm />
        </main>
      </div>
    </>
  )
}

export default CreateListingPage
