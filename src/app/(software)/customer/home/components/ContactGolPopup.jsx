import React, { useState } from 'react';
import { X, Phone, Mail, MessageCircle, DollarSign, Truck, Package, Clock, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ContactGolPopup({ onClose }) {
  const [selectedService, setSelectedService] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    { id: 'cfs', label: 'CFS Services', icon: Package },
    { id: 'transport', label: 'Transport', icon: Truck },
    { id: '3pl', label: '3PL Services', icon: Package },
    { id: 'warehouse', label: 'Warehouse', icon: Package },
    { id: 'custom', label: 'Custom Solution', icon: Package }
  ];

  const contactMethods = [
    { id: 'phone', label: 'Phone Call', icon: Phone, description: 'Get instant quotes over the phone' },
    { id: 'email', label: 'Email', icon: Mail, description: 'Detailed proposals via email' },
    { id: 'chat', label: 'Live Chat', icon: MessageCircle, description: 'Chat with our experts now' }
  ];

  const handleSubmit = () => {
    if (selectedService && contactMethod) {
      setIsSubmitted(true);
      // Here you would typically send the data to your backend
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6">
          <div className="bg-white shadow-2xl rounded-xl w-full max-w-md mx-auto p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Our team will contact you within 24 hours with the best pricing for your logistics needs.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                <strong>Next Steps:</strong> Check your email for confirmation and prepare your shipment details.
              </p>
            </div>
            <Button 
              title="Close" 
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6">
        <div className="bg-white shadow-2xl rounded-xl w-full max-w-2xl mx-auto overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Get Better Pricing</h2>
            </div>
            <p className="text-green-100">
              Contact GOL directly for personalized quotes and exclusive rates
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Benefits Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Why Contact GOL Directly?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Up to 30% better pricing than standard rates</li>
                <li>• Customized solutions for your specific needs</li>
                <li>• Priority customer support</li>
                <li>• Flexible payment terms</li>
              </ul>
            </div>

            {/* Service Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What service are you interested in?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        selectedService === service.id
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <ServiceIcon className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm font-medium">{service.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Method Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How would you like to be contacted?</h3>
              <div className="space-y-3">
                {contactMethods.map((method) => {
                  const MethodIcon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setContactMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        contactMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MethodIcon className={`w-5 h-5 ${
                          contactMethod === method.id ? 'text-green-600' : 'text-gray-600'
                        }`} />
                        <div>
                          <div className={`font-medium ${
                            contactMethod === method.id ? 'text-green-700' : 'text-gray-900'
                          }`}>
                            {method.label}
                          </div>
                          <div className={`text-sm ${
                            contactMethod === method.id ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgency Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Contact us within the next 24 hours to lock in special pricing for Q1 2024.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Maybe Later
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedService || !contactMethod}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedService && contactMethod
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Get My Quote
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">Or contact us directly:</p>
              <div className="flex justify-center gap-6 text-sm">
                <a href="tel:+1234567890" className="flex items-center gap-1 text-green-600 hover:text-green-700">
                  <Phone className="w-4 h-4" />
                  +1 (234) 567-890
                </a>
                <a href="mailto:sales@gollogistics.com" className="flex items-center gap-1 text-green-600 hover:text-green-700">
                  <Mail className="w-4 h-4" />
                  sales@gollogistics.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
