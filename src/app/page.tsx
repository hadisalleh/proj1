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
              Cari Pengembaraan Memancing Sempurna Anda
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto px-4">
              Temui perjalanan memancing yang menakjubkan di seluruh dunia. Bandingkan harga, baca ulasan, dan tempah pengembaraan seterusnya anda.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">Bersedia untuk memulakan pengembaraan memancing anda?</p>
                <Link
                  href="/trips"
                  className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-md transition-colors duration-200 text-base touch-manipulation"
                >
                  <Search className="h-5 w-5" />
                  <span>Layari Semua Perjalanan Memancing</span>
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
              Mengapa Pilih FishTrip?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menghubungkan anda dengan pengalaman memancing terbaik di seluruh dunia, memastikan pengembaraan yang selamat, berkesan, dan menarik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pemandu Berlesen</h3>
              <p className="text-gray-600">Semua pemandu memancing kami adalah profesional berlesen dengan pengalaman bertahun-tahun.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Penilaian Terbaik</h3>
              <p className="text-gray-600">Perjalanan memancing berkadar tertinggi dengan ribuan ulasan 5-bintang daripada pelanggan yang gembira.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Anchor className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Peralatan Premium</h3>
              <p className="text-gray-600">Peralatan memancing berkualiti tinggi dan peralatan keselamatan disertakan dalam setiap perjalanan.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Fish className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tangkapan Terjamin</h3>
              <p className="text-gray-600">Kami tahu tempat dan masa terbaik untuk memastikan anda mendapat pengalaman memancing yang menakjubkan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Perjalanan Memancing Pilihan
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Pengembaraan terpilih daripada pengalaman memancing paling popular dan berkadar tinggi kami.
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pengembaraan Memancing Laut Dalam</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Marina Bay</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>8 jam</span>
                  <Users className="h-4 w-4 ml-4 mr-1" />
                  <span>Sehingga 6 tetamu</span>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900">5.0</span>
                  <span className="ml-1 text-sm text-gray-600">(24 ulasan)</span>
                </div>
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Bot Memancing Sukan
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Laut Dalam
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      Trolling
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100 gap-2">
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    Bermula dari <span className="font-semibold text-gray-900">$299</span>
                  </div>
                  <Link
                    href="/trips"
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-3 rounded-md transition-colors duration-200 touch-manipulation text-center"
                  >
                    Lihat Butiran
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Charter Memancing Matahari Terbenam</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Pelabuhan Sunset</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>4 jam</span>
                  <Users className="h-4 w-4 ml-4 mr-1" />
                  <span>Sehingga 8 tetamu</span>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900">4.8</span>
                  <span className="ml-1 text-sm text-gray-600">(18 ulasan)</span>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Memancing Terumbu Separuh Hari</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Marina Terumbu Karang</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>4 jam</span>
                  <Users className="h-4 w-4 ml-4 mr-1" />
                  <span>Sehingga 4 tetamu</span>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-900">4.9</span>
                  <span className="ml-1 text-sm text-gray-600">(31 ulasan)</span>
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
              Lihat Semua Perjalanan
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Destinasi Memancing Popular
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Temui tempat memancing terbaik dunia dengan pilihan destinasi premium yang dikurasi kami.
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
              Dipercayai oleh Ribuan Pemancing
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              Sertai komuniti peminat memancing kami dan cipta kenangan yang kekal seumur hidup.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Pelanggan Gembira</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1,200+</div>
              <div className="text-blue-100">Perjalanan Memancing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">150+</div>
              <div className="text-blue-100">Destinasi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-blue-100">Purata Penilaian</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Bersedia untuk Pengembaraan Memancing Seterusnya?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Layari koleksi perjalanan memancing premium kami dan tempah percutian sempurna anda hari ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trips"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors touch-manipulation"
            >
              Layari Semua Perjalanan
            </Link>
            <Link
              href="/auth/signup"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors touch-manipulation"
            >
              Daftar Percuma
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
                Pintu masuk anda kepada pengalaman memancing terbaik dunia. Selamat, profesional, dan tidak dapat dilupakan.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Pautan Pantas</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/trips" className="hover:text-white transition-colors">Layari Perjalanan</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Log Masuk</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">Profil Saya</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Sokongan</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garis Panduan Keselamatan</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Syarikat</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dasar Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terma Perkhidmatan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FishTrip. Hak cipta terpelihara. Dibina dengan ❤️ untuk peminat memancing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
