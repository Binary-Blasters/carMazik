import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Gauge,
  Users,
  Shield,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/textarea";
import LoadingScreen from "../components/ui/LoadingScreen";
import CarCard from "../components/CarCard";

import { getCarById, getCars } from "../api/car";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);

        const carData = await getCarById(id);
        setCar(carData);

        const relatedRes = await getCars({
          brand: carData.brand,
          fuelType: carData.fuelType,
          limit: 4,
        });

        const filtered = relatedRes.cars.filter(
          (c) => c._id !== carData._id
        );

        setRelatedCars(filtered);
      } catch (err) {
        console.error("❌ Failed to load car", err);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold">Car not found</h2>
      </div>
    );
  }

  const images =
    car.images?.length > 0
      ? car.images.map((img) => `${BASE_IMAGE_URL}${img}`)
      : ["/car-placeholder.png"];

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(car.price);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("📨 Contact Seller:", contactForm);
    alert("Seller will contact you soon!");
    setContactForm({ name: "", phone: "", message: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Gallery */}
            <Card>
              <CardContent className="p-0 relative">
                <img
                  src={images[currentImage]}
                  alt={car.title}
                  className="w-full h-96 object-cover"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImage((i) => (i - 1 + images.length) % images.length)
                      }
                      className="absolute left-4 top-1/2 bg-white p-2 rounded-full"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImage((i) => (i + 1) % images.length)
                      }
                      className="absolute right-4 top-1/2 bg-white p-2 rounded-full"
                    >
                      <ChevronRight />
                    </button>
                  </>
                )}

                {car.status === "approved" && (
                  <Badge className="absolute top-4 left-4 bg-green-500">
                    <Shield className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-2">
                  {car.brand} {car.model} {car.variant}
                </h1>

                <div className="flex gap-4 text-gray-600 mb-4">
                  <span><MapPin className="inline h-4 w-4 mr-1" />{car.location}</span>
                  <span><Calendar className="inline h-4 w-4 mr-1" />{car.year}</span>
                </div>

                <div className="text-3xl font-bold mb-6">{price}</div>
                <p className="text-gray-700">{car.description}</p>
              </CardContent>
            </Card>

            {/* Specs */}
            <Card>
              <CardHeader>
                <CardTitle>Car Specifications</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Spec icon={<Fuel />} label="Fuel" value={car.fuelType} />
                <Spec icon={<Settings />} label="Transmission" value={car.transmission} />
                <Spec icon={<Gauge />} label="KM Driven" value={car.kmDriven.toLocaleString()} />
                <Spec icon={<Users />} label="Ownership" value={car.ownership} />
              </CardContent>
            </Card>

            {/* Features */}
            {car.features?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{f}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{car.seller?.name}</p>
                <p className="text-sm text-gray-500">{car.seller?.contact}</p>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    required
                  />
                  <Textarea
                    placeholder="Message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                  />
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RELATED CARS */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Cars</h2>

          {relatedCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((c) => (
                <CarCard key={c._id} car={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              🚗 No related cars yet. New cars coming soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- SMALL COMPONENTS ---------- */

const Spec = ({ icon, label, value }) => (
  <div className="bg-gray-100 p-4 rounded text-center">
    <div className="mx-auto mb-2 text-blue-600">{icon}</div>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
);

export default CarDetails;
