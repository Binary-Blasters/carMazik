import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Gauge,
  Users,
  Shield,
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { mockCars } from '../mockData';
import CarCard from '../components/CarCard';
import { toast } from '../hooks/use-toast';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = mockCars.find((c) => c.id === parseInt(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: 'I am interested in this car. Please contact me.'
  });

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
          <Link to="/listings">
            <Button>Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const relatedCars = mockCars
    .filter((c) => c.id !== car.id && (c.brand === car.brand || c.fuelType === car.fuelType))
    .slice(0, 4);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Inquiry Sent!",
      description: "Our team will contact you shortly.",
    });
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: 'I am interested in this car. Please contact me.'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 cursor-pointer hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={car.images[currentImageIndex]}
                    alt={car.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {car.certified && (
                    <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Navigation Arrows */}
                  {car.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-900" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronRight className="h-6 w-6 text-gray-900" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {car.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${car.name} ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 object-cover rounded cursor-pointer transition-all ${
                        index === currentImageIndex
                          ? 'ring-2 ring-blue-600 opacity-100'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

         
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
                    <div className="flex items-center text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {car.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {car.year}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-left md:text-right">
                    <div className="text-3xl font-bold text-gray-900">{formatPrice(car.price)}</div>
                    {car.originalPrice && (
                      <div className="text-gray-400 line-through">{formatPrice(car.originalPrice)}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Fuel className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-500">Fuel Type</div>
                    <div className="font-semibold text-gray-900">{car.fuelType}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Settings className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-500">Transmission</div>
                    <div className="font-semibold text-gray-900">{car.transmission}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Gauge className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-500">KM Driven</div>
                    <div className="font-semibold text-gray-900">{car.mileage.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-500">Owners</div>
                    <div className="font-semibold text-gray-900">{car.owners} Owner</div>
                  </div>
                </div>

   
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>

           
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Engine</span>
                      <span className="font-semibold text-gray-900">{car.specs.engine}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Power</span>
                      <span className="font-semibold text-gray-900">{car.specs.power}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Seating</span>
                      <span className="font-semibold text-gray-900">{car.specs.seating}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Boot Space</span>
                      <span className="font-semibold text-gray-900">{car.specs.bootSpace}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {car.warranty && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500 p-3 rounded-full">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Warranty Included</h3>
                      <p className="text-gray-700">{car.warranty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

   
          <div className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Inquiry
                  </Button>
                  <Button type="button" variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Seller
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Buy from Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">200+ Quality Checks</div>
                    <div className="text-sm text-gray-600">Every car thoroughly inspected</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Comprehensive Warranty</div>
                    <div className="text-sm text-gray-600">Extended warranty available</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Easy Financing</div>
                    <div className="text-sm text-gray-600">Best loan rates available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


        {relatedCars.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Cars You May Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetails;
