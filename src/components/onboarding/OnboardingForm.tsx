import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Store, User, MapPin, ShoppingBag, Palette, Check, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { onboardUser } from '@/hooks/useApi';

export const  OnboardingForm:React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const {mutateAsync} = onboardUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '', subdomain: '', ownerName: '', email: '', phone: '',
    address: '', city: '', country: '', businessType: '', theme: ''
  });

  const steps = [
    {
      title: "Store Info",
      icon: Store,
      color: "bg-blue-500",
      fields: [
        { name: 'storeName', label: 'Store Name', placeholder: 'My Store' },
        { name: 'subdomain', label: 'Subdomain', placeholder: 'mystore' }
      ]
    },
    {
      title: "Personal",
      icon: User,
      color: "bg-purple-500",
      fields: [
        { name: 'ownerName', label: 'Owner Name', placeholder: 'John Doe' },
        { name: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
        { name: 'phone', label: 'Phone', placeholder: '+1234567890', type: 'tel' }
      ]
    },
    {
      title: "Address",
      icon: MapPin,
      color: "bg-green-500",
      fields: [
        { name: 'address', label: 'Address', placeholder: '123 Main St' },
        { name: 'city', label: 'City', placeholder: 'New York' },
        { name: 'country', label: 'Country', placeholder: 'USA' }
      ]
    },
    {
      title: "Business",
      icon: ShoppingBag,
      color: "bg-orange-500",
      fields: [
        { 
          name: 'businessType', 
          label: 'Business Type', 
          type: 'select',
          options: ['Fashion', 'Electronics', 'Home & Garden', 'Health & Beauty', 'Food & Beverages', 'Other']
        }
      ]
    },
    {
      title: "Theme",
      icon: Palette,
      color: "bg-teal-500",
      fields: [
        { 
          name: 'theme', 
          label: 'Choose Theme', 
          type: 'theme',
          options: [
            { name: 'Ocean', color: 'bg-blue-500' },
            { name: 'Forest', color: 'bg-green-500' },
            { name: 'Sunset', color: 'bg-orange-500' },
            { name: 'Lavender', color: 'bg-purple-500' }
          ]
        }
      ]
    }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    return steps[currentStep].fields.every(field => formData[field.name]?.trim());
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {

      console.log('form data:', formData);
      mutateAsync(formData);
      // setIsLoading(true);
      //onboard
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-sm w-full text-center border border-white/20">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Setting up your store</h2>
          <div className="space-y-3">
            <div className="flex items-center text-green-400 bg-green-500/20 p-3 rounded-xl">
              <Check className="w-4 h-4 mr-3" />
              <span className="text-sm">Store created</span>
            </div>
            <div className="flex items-center text-yellow-400 bg-yellow-500/20 p-3 rounded-xl">
              <Loader2 className="w-4 h-4 mr-3 animate-spin" />
              <span className="text-sm">Applying theme</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-white/80 rounded-full px-4 py-2 mb-4 shadow-lg">
            <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
            <span className="text-sm font-semibold">Store Setup</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Create Your Store</h1>
          <p className="text-gray-600">Transform your idea into reality</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
          </div>
          <div className="bg-white/60 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                    index < currentStep
                      ? 'bg-green-500 border-green-500 text-white'
                      : index === currentStep
                      ? `${step.color} border-transparent text-white shadow-lg`
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      React.createElement(step.icon, { className: "w-5 h-5" })
                    )}
                  </div>
                  <span className="text-xs mt-2 font-medium text-center hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-4 h-2 bg-gray-200 rounded-full">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg sticky top-4">
              <div className={`${steps[currentStep].color} rounded-xl p-4 mb-6 text-white`}>
                <div className="flex items-center space-x-3">
                  {React.createElement(steps[currentStep].icon, { className: "w-8 h-8" })}
                  <div>
                    <h3 className="font-bold text-lg">{steps[currentStep].title}</h3>
                    <p className="text-sm opacity-90">Step {currentStep + 1}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    index === currentStep 
                      ? 'bg-blue-50 text-blue-700' 
                      : index < currentStep
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-400'
                  }`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      index < currentStep ? 'bg-green-500 text-white' : 
                      index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}>
                      {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 ${steps[currentStep].color} rounded-xl flex items-center justify-center`}>
                    {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{steps[currentStep].title}</h2>
                    <p className="text-gray-600">Step {currentStep + 1} of {steps.length}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {steps[currentStep].fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">{field.label}</label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name]}
                        onChange={(e) => updateFormData(field.name, e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option, i) => (
                          <option key={i} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'theme' ? (
                      <div className="grid grid-cols-2 gap-4">
                        {field.options.map((theme, i) => (
                          <div
                            key={i}
                            onClick={() => updateFormData(field.name, theme.name)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                              formData[field.name] === theme.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg ${theme.color}`}></div>
                              <span className="font-medium">{theme.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={formData[field.name]}
                        onChange={(e) => updateFormData(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`flex items-center px-8 py-3 rounded-xl font-medium transition-all ${
                    isStepValid()
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Launch Store
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}