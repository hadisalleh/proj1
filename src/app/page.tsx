import Link from 'next/link';
import { Star, MapPin, Users, Clock, Shield, Award, Anchor, Fish, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Find Your Perfect Fishing Adventure
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto px-4">
              Discover amazing fishing trips around the world. Compare prices, read reviews, and book your next adventure.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">Ready to start your fishing adventure?</p>
                <Link
                  href="/trips"
                  className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-md transition-colors duration-200 text-base touch-manipulation"
                >
                  <Search className="h-5 w-5" />
                  <span>Browse All Fishing Trips</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FishTrip?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              We connect you with the best fishing experiences around the world, ensuring safe, memorable, and exciting adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Licensed Guides</h3>
              <p className="text-gray-600">All our fishing guides are licensed professionals with years of experience.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Rated</h3>
              <p className="text-gray-600">Top-rated fishing trips with thousands of 5-star reviews from happy customers.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Anchor className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Equipment</h3>
              <p className="text-gray-600">High-quality fishing gear and safety equipment included in every trip.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Fish className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Guaranteed Catch</h3>
              <p className="text-gray-600">We know the best spots and times to ensure you have an amazing fishing experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Fishing Trips
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked adventures from our most popular and highly-rated fishing experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Trip 1 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
                <div className="text-white text-6xl">🌊</div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
                  <span className="text-sm font-semibold text-gray-900">$299</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deep Sea Fishing Adventure</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Marina Bay</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>8 hours</span>
                  <Users className="h-4 w-4 ml-4 mr-1" />
                  <span>Up to 6 guests</span>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900">5.0</span>
                  <span className="ml-1 text-sm text-gray-600">(24 reviews)</span>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Sport Fishing Boat
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Deep Sea
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Trolling
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100 gap-2">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Starting from <span className="font-semibold text-gray-900">$299</span>
                  </div>
                  <Link
                    href="/trips"
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-3 rounded-md transition-colors duration-200 touch-manipulation text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Trip 2 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center relative">
                <div className="text-white text-6xl">🌅</div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
                  <span className="text-sm font-semibold text-gray-900">$189</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sunset Fishing Charter</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Sunset Harbor</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>4 hours</span>
                  <Users className="h-4 w-4 ml-4 mr-1" />
                  <span>Up to 8 guests</span>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900">4.8</span>
                  <span className="ml-1 text-sm text-gray-600">(18 reviews)</span>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Pontoon Boat
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Inshore
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Light Tackle
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100 gap-2">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Starting from <span className="font-semibold text-gray-900">$189</span>
                  </div>
                  <Link
                    href="/trips"
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-3 rounded-md transition-colors duration-200 touch-manipulation text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Trip 3 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative">
                <div className="text-white text-6xl">🐠</div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
                  <span className="text-sm font-semibold text-gray-900">$149</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Half Day Reef Fishing</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Coral Reef Marina</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>4 hours</span>
                  <Users className="h-4 w-4 ml-4 mr-1" />
                  <span>Up to 4 guests</span>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900">4.9</span>
                  <span className="ml-1 text-sm text-gray-600">(31 reviews)</span>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Center Console
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Reef Fishing
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Bottom Fishing
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100 gap-2">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Starting from <span className="font-semibold text-gray-900">$149</span>
                  </div>
                  <Link
                    href="/trips"
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-3 rounded-md transition-colors duration-200 touch-manipulation text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/trips"
              className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors touch-manipulation"
            >
              View All Trips
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Fishing Destinations
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the world's best fishing spots with our curated selection of premium destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Destination 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-6xl">🌊</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Miami, Florida</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Deep Sea & Inshore</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm">4.8 (324 reviews)</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Experience world-class deep sea fishing in the crystal clear waters of Miami. Perfect for beginners and experts alike.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">From $299</span>
                  <Link 
                    href="/trips?location=Miami"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors touch-manipulation"
                  >
                    View Trips
                  </Link>
                </div>
              </div>
            </div>

            {/* Destination 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-white text-6xl">🏝️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Key West, Florida</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Reef & Wreck Fishing</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm">4.9 (256 reviews)</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Explore the vibrant coral reefs and historic wrecks around Key West for an unforgettable fishing adventure.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">From $189</span>
                  <Link 
                    href="/trips?location=Key West"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors touch-manipulation"
                  >
                    View Trips
                  </Link>
                </div>
              </div>
            </div>

            {/* Destination 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <div className="text-white text-6xl">🌅</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">San Diego, California</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Pacific Coast</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm">4.7 (189 reviews)</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Fish the Pacific waters for yellowtail, tuna, and more in beautiful San Diego's year-round fishing paradise.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">From $249</span>
                  <Link 
                    href="/trips?location=San Diego"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors touch-manipulation"
                  >
                    View Trips
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 sm:py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Thousands of Anglers
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Join our community of fishing enthusiasts and create memories that last a lifetime.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1,200+</div>
              <div className="text-blue-100">Fishing Trips</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-blue-100">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready for Your Next Fishing Adventure?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Browse our collection of premium fishing trips and book your perfect getaway today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trips"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors touch-manipulation"
            >
              Browse All Trips
            </Link>
            <Link
              href="/auth/signup"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors touch-manipulation"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-4">🎣 FishTrip</div>
              <p className="text-gray-400 mb-4">
                Your gateway to the world's best fishing experiences. Safe, professional, and unforgettable.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/trips" className="hover:text-white transition-colors">Browse Trips</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FishTrip. All rights reserved. Built with ❤️ for fishing enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
