import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Fuel, Settings, MapPin, Calendar, Shield } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/button';
import { Badge } from './ui/Badge';

const CarCard = ({ car }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-IN').format(mileage);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200">
      <div className="relative overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
        {car.certified && (
          <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
            <Shield className="h-3 w-3 mr-1" />
            Certified
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {car.name}
          </h3>
          <p className="text-sm text-gray-500">{car.year}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center text-gray-600">
            <Settings className="h-4 w-4 mr-1" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Fuel className="h-4 w-4 mr-1" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatMileage(car.mileage)} km</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{car.location.split(',')[0]}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(car.price)}</span>
              {car.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  {formatPrice(car.originalPrice)}
                </span>
              )}
            </div>
          </div>
          <Link to={`/car/${car.id}`}>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;