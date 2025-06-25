'use client'
import React, { useState } from 'react'
import { ArrowLeft, Package, MapPin, Clock, Truck, CheckCircle } from 'lucide-react'
import Footer from '../components/footer/footer'

const TrackingPage = () => {
  const [containerID, setContainerID] = useState('')
  const [orderID, setOrderID] = useState('')
  const [shipmentData, setShipmentData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock shipment data - in real app, this would come from an API
  const mockShipmentData = {
    'MSKU1234567': {
      'ORD-2024001': {
        currentLocation: 'Mumbai CFS',
        destination: 'Singapore Logistics',
        estimatedArrival: '20th June, 2025',
        transportMode: 'Transport',
        lastUpdated: '12-12-2025',
        status: 'In Transport',
        timeline: [
          { step: 'Pickup', status: 'completed', date: '10-12-2025' },
          { step: 'Port Arrival', status: 'completed', date: '11-12-2025' },
          { step: 'Onboard', status: 'current', date: '12-12-2025' },
          { step: 'Arrived', status: 'pending', date: '20-06-2025' }
        ],
        eta: '20th June, 2025',
        etaDescription: 'Estimated time of arrival at Singapore Port'
      }
    }
  }

  const handleTrackShipment = () => {
    setLoading(true)
    setError('')
    
    // Simulate API call
    setTimeout(() => {
      if (mockShipmentData[containerID] && mockShipmentData[containerID][orderID]) {
        setShipmentData(mockShipmentData[containerID][orderID])
      } else {
        setError('Shipment not found. Please check your Container ID and Order ID.')
        setShipmentData(null)
      }
      setLoading(false)
    }, 1000)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-white" />
      case 'current':
        return <Truck className="w-6 h-6 text-white" />
      case 'pending':
        return <Clock className="w-6 h-6 text-gray-400" />
      default:
        return <Package className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-primary'
      case 'current':
        return 'bg-light-primary'
      case 'pending':
        return 'bg-secondary'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <button 
        onClick={() => window.history.back()}
        className="flex items-center gap-2 mb-6 text-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>


      <div className="bg-primary text-white p-8 rounded-t-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Track Your Shipment</h1>
          <p className="text-green-100">Enter your container or order ID to get real-time updates</p>
        </div>
      </div>


      <div className="bg-accent p-6 shadow-lg">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Container ID</label>
            <input
              type="text"
              value={containerID}
              onChange={(e) => setContainerID(e.target.value)}
              placeholder="e.g. MSKU1234567"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Order ID</label>
            <input
              type="text"
              value={orderID}
              onChange={(e) => setOrderID(e.target.value)}
              placeholder="e.g. ORD-2024001"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>
        
        <button
          onClick={handleTrackShipment}
          disabled={!containerID || !orderID || loading}
          className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Tracking...
            </>
          ) : (
            <>
              <Package className="w-5 h-5" />
              Track Shipment
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}
      </div>


      {shipmentData && (
        <div className="mt-6 space-y-6">
     
          <div className="bg-accent rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Shipment Details</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary font-medium">Current Location:</span>
                  <span className="text-foreground font-semibold">{shipmentData.currentLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary font-medium">Destination:</span>
                  <span className="text-foreground font-semibold">{shipmentData.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary font-medium">Estimated Arrival:</span>
                  <span className="text-foreground font-semibold">{shipmentData.estimatedArrival}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary font-medium">Transport Mode:</span>
                  <span className="text-foreground font-semibold">{shipmentData.transportMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary font-medium">Last Updated:</span>
                  <span className="text-foreground font-semibold">{shipmentData.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary font-medium">Status:</span>
                  <span className="px-3 py-1 bg-light-primary text-white rounded-full text-sm font-medium">
                    {shipmentData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

 
          <div className="bg-accent rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Shipment Timeline</h2>
            </div>

            <div className="relative">
              {shipmentData.timeline.map((item, index) => (
                <div key={index} className="flex items-center mb-8 last:mb-0">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getStatusColor(item.status)} relative z-10`}>
                    {getStatusIcon(item.status)}
                  </div>
                  
                  {index < shipmentData.timeline.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                  )}
                  
                  <div className="ml-6 flex-1">
                    <h3 className={`font-semibold ${item.status === 'current' ? 'text-light-primary' : 'text-foreground'}`}>
                      {item.step}
                    </h3>
                    <p className="text-secondary text-sm">
                      {item.status === 'completed' ? 'Completed' : 
                       item.status === 'current' ? 'Current Step' : 'Pending'}
                    </p>
                    {item.date && (
                      <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-background rounded-lg border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">ETA: {shipmentData.eta}</span>
              </div>
              <p className="text-secondary text-sm">{shipmentData.etaDescription}</p>
            </div>
          </div>
        </div>
      )}
        <Footer />
    </div>
  )
}

export default TrackingPage