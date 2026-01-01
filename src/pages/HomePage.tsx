import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Globe, Smartphone, Building2, Phone, Mail, MapPin, ExternalLink, TrendingUp, Award, CheckCircle2, Menu, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export default function HomePage() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [
    'https://pbs.twimg.com/media/E5hnV8gWEAEnr8F.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPqv9WCsTMoNgSC4dTAyZcvykd1bJYiLYpjA&s',
    'https://i.ytimg.com/vi/y2nzN6Lk8rI/maxresdefault.jpg',
    'https://i.ytimg.com/vi/lhJGQc_TLx0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDCc3r5NedzTtTeErXuzo-oBvkCEA'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:bg-black transition-all duration-500">
      {/* Compact Advanced Navbar */}
      <header className="bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800 sticky top-0 z-50 shadow-sm dark:shadow-black/50 transition-all duration-300 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUf1_tOcL7tsqxoA7CKzroOtYbcbMxrkI6dg&s"
              alt="Zeepay Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Zeepay</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium hover:scale-105">About</a>
            <a href="#services" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium hover:scale-105">Services</a>
            <a href="#offices" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium hover:scale-105">Offices</a>
            <a
              href="https://myzeepay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium flex items-center space-x-1 hover:scale-105"
            >
              <span>Main Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200 hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-5 duration-200 w-full">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
              >
                About
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
              >
                Services
              </a>
              <a
                href="#offices"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
              >
                Offices
              </a>
              <a
                href="https://myzeepay.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
              >
                <span>Main Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    toggleDarkMode()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 text-center overflow-hidden">
        {/* Dark mode overlay */}
        <div className="absolute inset-0 bg-black/0 dark:bg-black/10 transition-all duration-500"></div>
        {/* Image Carousel */}
        <div className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none transition-opacity duration-500">
          <div className="relative w-full h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={image} 
                  alt={`Zeepay ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-blue-600 dark:bg-blue-400 w-8'
                  : 'bg-gray-400 dark:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in-0 duration-1000 z-10 transition-all duration-500">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-800 dark:text-blue-300 text-sm font-medium mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <TrendingUp className="w-4 h-4 animate-pulse" />
            <span>Fastest Growing Fintech in Africa</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight animate-in slide-in-from-bottom-4 duration-700 delay-500">
            Connecting Digital Assets
            <br />
            <span className="text-blue-600 dark:text-blue-400 animate-in slide-in-from-bottom-4 duration-700 delay-700">Across the Globe</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 dark:text-black mb-6 max-w-4xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-1000">
            Zeepay is the fastest growing fintech focusing on digital rails to connect digital assets such as mobile money wallets,
            cards, ATMs, bank accounts, and digital tokens to International Money Transfer Operators, Payments, Subscriptions,
            International Airtime, and Refugee payments.
          </p>
          <p className="text-lg text-gray-700 dark:text-black mb-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-1200">
            In an effort to improve financial inclusion and make the world a better place to live. We are a Mobile Financial Services
            Company with offices around the world including the United Kingdom, regulated by the Financial Conduct Authority (FCA #592538)
            and Bank of Ghana (BOG PSD/ZGL/20/03).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-4 duration-700 delay-1500">
            <Link
              to="/login"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 duration-200 group"
            >
              Access Dashboard
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="px-8 py-4 bg-white dark:bg-black text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-900 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-in fade-in-0 duration-1000 delay-300">
          <div className="text-center p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 group">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:animate-pulse">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Countries</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 group">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:animate-pulse">10M+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Transactions</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 group">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:animate-pulse">5+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Offices</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 group">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:animate-pulse">100K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
          </div>
        </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section id="about" className="w-full py-20 bg-gray-50/50 dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto animate-in fade-in-0 duration-1000 delay-300">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-in slide-in-from-bottom-4 duration-700 delay-500">
              Who Are We?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-700">
              Leading the digital financial revolution across Africa and beyond
            </p>
          </div>
          <div className="bg-white dark:bg-black rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 animate-in slide-in-from-bottom-4 duration-700 delay-1000">
            <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              <p className="text-xl animate-in fade-in-0 duration-700 delay-1200">
                Zeepay is the fastest growing fintech focusing on digital rails to connect digital assets such as mobile money
                wallets, cards, ATMs, bank accounts, and digital tokens to International Money Transfer Operators, Payments,
                Subscriptions, International Airtime, and Refugee payments.
              </p>
              <p className="animate-in fade-in-0 duration-700 delay-1400">
                In an effort to improve financial inclusion and make the world a better place to live, we are a Mobile Financial
                Services Company with offices around the world including the United Kingdom and regulated by the Financial Conduct
                Authority and other regulators across Africa.
              </p>
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 animate-in fade-in-0 duration-700 delay-1600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center animate-pulse">
                  <Award className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Regulatory Compliance
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-900 p-3 rounded-lg transition-colors duration-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0 animate-in zoom-in-50 duration-500 delay-1800" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Financial Conduct Authority</p>
                      <p className="text-sm">FCA Registration #592538</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-900 p-3 rounded-lg transition-colors duration-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0 animate-in zoom-in-50 duration-500 delay-2000" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Bank of Ghana</p>
                      <p className="text-sm">PSD/ZGL/20/03</p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm animate-in fade-in-0 duration-700 delay-2200">
                  These regulatory approvals ensure the highest standards of security, compliance, and reliability in all our operations,
                  giving our customers confidence in every transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full py-20 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Do We Do?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive financial solutions connecting digital assets across multiple platforms and networks
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Mobile Money</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Connect and manage mobile money wallets across all major networks including MTN Mobile Money, Vodafone Cash, 
              and AirtelTigo Money in Ghana. Seamless integration for individuals and businesses.
            </p>
          </div>
          <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Remittance</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              International money transfer services connecting digital assets to International Money Transfer Operators worldwide. 
              Fast, secure, and cost-effective cross-border payments.
            </p>
          </div>
          <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Domestic Transfers</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Fast and secure domestic money transfers within Ghana, connecting individuals and businesses seamlessly. 
              Real-time processing with instant notifications.
            </p>
          </div>
          <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Micro-Insurance</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Affordable insurance solutions designed to improve financial inclusion and protect our customers. 
              Tailored products for individuals and small businesses.
            </p>
          </div>
          <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Payments</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Comprehensive payment solutions including wallet top-ups, bill payments, school fees, utility bills, 
              and subscription services. One platform for all your payment needs.
            </p>
          </div>
          <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Termination Services</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Connect to banks, cards, and mobile wallets for seamless financial transactions across multiple channels. 
              Enterprise-grade API solutions for businesses.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full py-20 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 animate-in fade-in-0 duration-1000 delay-300">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 animate-in slide-in-from-left-4 duration-700 delay-500">
            <h3 className="text-3xl font-bold mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Our Mission
            </h3>
            <p className="text-blue-50 leading-relaxed text-lg">
              To improve financial inclusion and make the world a better place to live by connecting digital assets
              and enabling seamless financial transactions for everyone, everywhere.
            </p>
          </div>
          <div className="bg-white dark:bg-black rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 animate-in slide-in-from-right-4 duration-700 delay-700">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="mr-2">🔭</span>
              Our Vision
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              To be the leading fintech platform in Africa, connecting millions of people to secure, instant, and
              affordable financial services through innovative digital solutions.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Offices Section */}
      <section id="offices" className="w-full py-20 bg-gray-50/50 dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-in fade-in-0 duration-1000 delay-300">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-in slide-in-from-bottom-4 duration-700 delay-500">
            Our Offices
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 animate-in slide-in-from-bottom-4 duration-700 delay-700">
            Serving customers across multiple continents
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-in fade-in-0 duration-1000 delay-300">
          <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 animate-in slide-in-from-left-4 duration-700 delay-500">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400 animate-pulse" />
              Zeepay JV UK
            </h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="leading-relaxed">
                  Nr1 Hampton House, Ground Floor B<br />
                  20-25 Albert Embankment<br />
                  London, United Kingdom<br />
                  SE1 7TJ
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 animate-in slide-in-from-right-4 duration-700 delay-700">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400 animate-pulse" />
              Zeepay Ghana
            </h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="leading-relaxed">
                  Second Circular Road<br />
                  Opposite Ghana International School<br />
                  Cantonments, Accra
                </span>
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUf1_tOcL7tsqxoA7CKzroOtYbcbMxrkI6dg&s" 
                  alt="Zeepay Logo" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <span className="text-2xl font-bold">Zeepay</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Connecting digital assets across the globe. Regulated by FCA and BOG. 
                Committed to financial inclusion and innovation.
              </p>
              <a
                href="https://myzeepay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1 transition-colors"
              >
                <span>Visit Main Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://myzeepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Find an Agent</a></li>
                <li><a href="https://myzeepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="https://myzeepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="https://myzeepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://myzeepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Report Fraud</a></li>
                <li><a href="https://myzeepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Complaint Procedure</a></li>
                <li><a href="https://myzeepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Lodge Complaint</a></li>
                <li><a href="https://myzeepay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a href="tel:+233308249000" className="hover:text-white transition-colors">+233 (0) 308 249 000</a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a href="tel:+233308249001" className="hover:text-white transition-colors">+233 (0) 308 249 001</a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a href="tel:+233308249002" className="hover:text-white transition-colors">+233 (0) 308 249 002</a>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a href="mailto:info@myzeepay.com" className="hover:text-white transition-colors">info@myzeepay.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 mb-2">&copy; 2026 Zeepay. All rights reserved.</p>
            <p className="text-sm text-gray-500">
              Zeepay is regulated by <strong className="text-gray-400">FCA - #592538</strong> and <strong className="text-gray-400">BOG - PSD/ZGL/20/03</strong>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
