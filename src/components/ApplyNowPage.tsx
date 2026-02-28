import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, Plus, X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectId, publicAnonKey, getBaseUrl } from '../utils/supabase/info';
import { makeServerRequest } from '../utils/supabase/client';
import { CATEGORY_CONFIG } from '../utils/categories';

// Define the catalog structure using centralized config
const CATALOGS = Object.fromEntries(
  Object.entries(CATEGORY_CONFIG).map(([key, value]) => [key, value.subcategories])
);

export function ApplyNowPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCatalog, setSelectedCatalog] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    ethnicity: '',
    countryOfResidence: '',
    whatsAppNumber: '',
    currentlyInUAE: '',
    currentCountry: '',
    residenceTel: '',
    mobileUAE: '',
    primaryLanguage: '',
    otherLanguages: '',
    catalog: '',
    subcategory: '',
    roleComment: '',
    showreelURL: '',
    instagramURL: '',
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleCatalogSelect = (catalog: string) => {
    setSelectedCatalog(catalog);
    setSelectedSubcategory('');
    setFormData(prev => ({
      ...prev,
      catalog,
      subcategory: ''
    }));
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setFormData(prev => ({
      ...prev,
      subcategory
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedCatalog) {
        setError('Please select a catalog');
        return;
      }
    } else if (currentStep === 2) {
      if (!selectedSubcategory) {
        setError('Please select a subcategory');
        return;
      }
    }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (uploadedImages.length + files.length <= 4) {
      setUploadedImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      setError('Email addresses do not match');
      setLoading(false);
      return;
    }

    if (!formData.catalog || !formData.subcategory) {
      setError('Please select both catalog and subcategory');
      setLoading(false);
      return;
    }

    // Demo mode check
    if (projectId === 'placeholder-project-id') {
      // Simulate successful submission in demo mode
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const submitFormData = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value);
      });

      // Add images
      uploadedImages.forEach((image) => {
        submitFormData.append('images', image);
      });

      const response = await fetch(`${getBaseUrl()}/functions/v1/make-server-53cfc738/applications/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: submitFormData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || 'Failed to submit application');
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setSelectedCatalog('');
    setSelectedSubcategory('');
    setFormData({
      email: '',
      confirmEmail: '',
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      nationality: '',
      ethnicity: '',
      countryOfResidence: '',
      whatsAppNumber: '',
      currentlyInUAE: '',
      currentCountry: '',
      residenceTel: '',
      mobileUAE: '',
      primaryLanguage: '',
      otherLanguages: '',
      catalog: '',
      subcategory: '',
      roleComment: '',
      showreelURL: '',
      instagramURL: '',
    });
    setUploadedImages([]);
  };

  if (submitted) {
    return (
      <div className="min-h-screen text-white px-6 py-8 flex items-center justify-center">
        <Card className="bg-green-900/20 border-green-500/30 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-4">Application Submitted Successfully!</h2>
            <p className="text-white/70 mb-6">
              Thank you for your application for <span className="text-yellow-400">{formData.catalog} → {formData.subcategory}</span>.
              Our team will review it and get back to you soon.
            </p>
            <Button
              onClick={resetForm}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 1: Catalog Selection
  if (currentStep === 1) {
    return (
      <div className="min-h-screen text-white px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl mb-4">Apply Now - Step 1 of 3</h1>
            <p className="text-sm sm:text-base text-white/70 mb-6">
              First, please select which catalog you would like to apply for.
            </p>
          </div>

          {error && (
            <Card className="bg-red-900/20 border-red-500/30 mb-6">
              <CardContent className="p-4">
                <p className="text-red-400 text-sm sm:text-base">{error}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-lg sm:text-xl">Select Your Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.keys(CATALOGS).map((catalog) => (
                  <button
                    key={catalog}
                    onClick={() => handleCatalogSelect(catalog)}
                    className={`p-4 sm:p-6 rounded-lg border-2 text-center transition-all duration-200 focus:outline-none focus:ring-0 active:ring-0 ${selectedCatalog === catalog
                      ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg transform scale-105'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                      }`}
                  >
                    <h3 className="text-base sm:text-lg font-medium mb-2">{catalog}</h3>
                    <p className="text-sm opacity-80">
                      {CATALOGS[catalog as keyof typeof CATALOGS].length} subcategories
                    </p>
                  </button>
                ))}
              </div>

              {selectedCatalog && (
                <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/5 rounded-lg">
                  <h4 className="text-yellow-400 mb-3 text-sm sm:text-base">Preview subcategories for {selectedCatalog}:</h4>
                  <div className="flex flex-wrap gap-2">
                    {CATALOGS[selectedCatalog as keyof typeof CATALOGS].map((sub) => (
                      <span key={sub} className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs sm:text-sm text-white/80">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 sm:mt-8">
                <Button
                  onClick={handleNextStep}
                  disabled={!selectedCatalog}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 sm:px-8 py-2.5 sm:py-3 disabled:opacity-50 w-full sm:w-auto"
                >
                  Next Step <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Subcategory Selection
  if (currentStep === 2) {
    return (
      <div className="min-h-screen text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl mb-4">Apply Now - Step 2 of 3</h1>
            <p className="text-white/70 mb-6">
              Now, please select the specific subcategory within <span className="text-yellow-400">{selectedCatalog}</span>.
            </p>
          </div>

          {error && (
            <Card className="bg-red-900/20 border-red-500/30 mb-6">
              <CardContent className="p-4">
                <p className="text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Select Your Subcategory in {selectedCatalog}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATALOGS[selectedCatalog as keyof typeof CATALOGS].map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => handleSubcategorySelect(subcategory)}
                    className={`p-6 rounded-lg border-2 text-center transition-all duration-200 focus:outline-none focus:ring-0 active:ring-0 ${selectedSubcategory === subcategory
                      ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg transform scale-105'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                      }`}
                  >
                    <h3 className="text-lg font-medium">{subcategory}</h3>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  className="bg-white/10 text-white border-yellow-500 hover:bg-white/20 hover:border-yellow-400 px-8 py-3"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!selectedSubcategory}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 disabled:opacity-50"
                >
                  Continue to Form <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 3: Main Application Form
  return (
    <div className="min-h-screen text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-4">Apply Now - Step 3 of 3</h1>
          <p className="text-white/70 mb-6">
            Complete your application for <span className="text-yellow-400">{selectedCatalog} → {selectedSubcategory}</span>
          </p>
        </div>

        {/* Demo Mode Notice */}
        {projectId === 'placeholder-project-id' && (
          <Card className="bg-blue-900/20 border-blue-500/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-blue-400 font-medium">Demo Mode Active</p>
                  <p className="text-white/70 text-sm">
                    This form will simulate submission. Configure Supabase to enable real functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-500/30 mb-6">
            <CardContent className="p-4">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Selected Category Display */}
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 font-medium">Selected Category:</p>
                  <p className="text-white text-lg">{selectedCatalog} → {selectedSubcategory}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  size="sm"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                >
                  Change Category
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Re Enter Email Address</Label>
                  <Input
                    type="email"
                    placeholder="RE ENTER YOUR EMAIL ADDRESS FOR CONFIRMATION"
                    value={formData.confirmEmail}
                    onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">First Name</Label>
                  <Input
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Last Name</Label>
                  <Input
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-white">Gender</Label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="" disabled className="bg-gray-900 text-gray-400">Select Gender</option>
                    <option value="Male" className="bg-gray-900 text-white">Male</option>
                    <option value="Female" className="bg-gray-900 text-white">Female</option>
                    <option value="Other" className="bg-gray-900 text-white">Other</option>
                  </select>
                </div>
                <div>
                  <Label className="text-white">Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Nationality</Label>
                  <Input
                    placeholder="NATIONALITY"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Ethnicity</Label>
                <Input
                  placeholder="ETHNICITY"
                  value={formData.ethnicity}
                  onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Country of Residence</Label>
                  <Input
                    placeholder="COUNTRY OF RESIDENCE"
                    value={formData.countryOfResidence}
                    onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white">What's App Number</Label>
                  <Input
                    placeholder="What's App Number"
                    value={formData.whatsAppNumber}
                    onChange={(e) => handleInputChange('whatsAppNumber', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Currently in UAE?</Label>
                  <Input
                    placeholder="Currently in UAE?"
                    value={formData.currentlyInUAE}
                    onChange={(e) => handleInputChange('currentlyInUAE', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Currently in which Country?</Label>
                  <Input
                    placeholder="Currently in which Country?"
                    value={formData.currentCountry}
                    onChange={(e) => handleInputChange('currentCountry', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Residence Tel.</Label>
                  <Input
                    placeholder="Residence Tel."
                    value={formData.residenceTel}
                    onChange={(e) => handleInputChange('residenceTel', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Mobile/UAE Number</Label>
                  <Input
                    placeholder="Mobile/UAE Number"
                    value={formData.mobileUAE}
                    onChange={(e) => handleInputChange('mobileUAE', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white">My Primary Language</Label>
                <Input
                  placeholder="MY PRIMARY LANGUAGE"
                  value={formData.primaryLanguage}
                  onChange={(e) => handleInputChange('primaryLanguage', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label className="text-white">Other Fluent Languages</Label>
                <Input
                  placeholder="OTHER FLUENT LANGUAGES"
                  value={formData.otherLanguages}
                  onChange={(e) => handleInputChange('otherLanguages', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Comments */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white">PLEASE COMMENT IF YOU THINK YOU FIT MORE THAN ONE ROLE</Label>
                <Textarea
                  placeholder="Enter your comment here..."
                  value={formData.roleComment}
                  onChange={(e) => handleInputChange('roleComment', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Social Media & Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white">Enter your showreel URL (YOUTUBE, VIMEO, etc)</Label>
                <Input
                  placeholder="Showreel URL"
                  value={formData.showreelURL}
                  onChange={(e) => handleInputChange('showreelURL', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label className="text-white">Enter your Instagram URL (if you have one)</Label>
                <Input
                  placeholder="Instagram URL"
                  value={formData.instagramURL}
                  onChange={(e) => handleInputChange('instagramURL', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Pictures */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-yellow-400">Upload Pictures</CardTitle>
              <p className="text-white/70 text-sm">
                PLEASE UPLOAD FOUR PHOTOS AS PER THE EXAMPLES BELOW.<br />
                ONLY UPLOAD HEADSHOTS AGAINST WHITE WALL, FULL BODY AND HALF BODY PHOTOS. OUR TALENT BOOKER WILL SELECT WHICH IMAGES GO LIVE<br />
                PLEASE NOTE THAT ONLY JPG AND JPEG FILES ARE ALLOWED WITH A MAXIMUM SIZE OF 2 MB PER PHOTO. ONLY FOUR IMAGES WILL BE ACCEPTED.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-white/10 rounded border border-white/20 flex items-center justify-center">
                      <span className="text-white/60 text-sm">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none focus:ring-0 active:ring-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 4 && (
                  <label className="aspect-square bg-white/10 rounded border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                    <Upload className="w-8 h-8 text-white/60 mb-2" />
                    <span className="text-white/60 text-sm">Add Picture</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-12 py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}