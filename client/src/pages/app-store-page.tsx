import React from "react";
import { AppStoreScreenshots } from "@/components/app-store/screenshots";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Share2, Award, Shield, Zap } from "lucide-react";

const AppStorePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[hsl(83,23%,95%)] to-[hsl(83,30%,90%)] py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <Badge variant="outline" className="bg-[hsl(100,40%,90%)] text-[hsl(100,40%,30%)] border-[hsl(100,40%,80%)] mb-4">
                App Store Ready
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[hsl(100,40%,40%)] to-[hsl(100,40%,30%)] bg-clip-text text-transparent">
                Your Life, Organized
              </h1>
              <p className="text-gray-700 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                iMe brings together your schedule, health metrics, finances, and personalized recommendations
                in one beautiful dashboard. Download now and take control of your day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-black text-white hover:bg-gray-900 flex items-center gap-2">
                  <Download size={18} />
                  <span>Download Now</span>
                </Button>
                <Button variant="outline" size="lg" className="border-gray-300 flex items-center gap-2">
                  <Share2 size={18} />
                  <span>Share App</span>
                </Button>
              </div>
              <div className="flex items-center justify-center md:justify-start mt-8">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">4.9 • 2,500+ Reviews</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-[hsl(100,40%,80%)] rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[hsl(100,30%,75%)] rounded-full filter blur-3xl opacity-30"></div>
                <div className="relative w-[280px]">
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-gradient-to-br from-green-400 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12">
                    New!
                  </div>
                  <div className="rounded-[40px] border-[14px] border-gray-800 bg-gray-800 shadow-xl overflow-hidden">
                    <div className="h-[500px] rounded-[26px] overflow-hidden">
                      <img 
                        src="https://placehold.co/240x500/2563eb/FFFFFF/png?text=iMe+App"
                        alt="iMe App" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="h-6 w-24 bg-gray-800 rounded-b-3xl mx-auto mt-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              iMe combines everything you need to stay organized, healthy, and on top of your finances.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[hsl(100,40%,95%)] to-[hsl(100,40%,90%)] p-6 rounded-xl">
              <div className="rounded-full bg-[hsl(100,40%,85%)] w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-[hsl(100,40%,40%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">
                Never miss an appointment again. Get reminders, manage conflicts, and view your day at a glance.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Calendar integration</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Smart notifications</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Timeline view</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Health Tracking</h3>
              <p className="text-gray-600">
                Monitor your steps, water intake, and sleep patterns to maintain a healthy lifestyle.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Activity monitoring</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Sleep analysis</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Hydration reminders</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Finance Management</h3>
              <p className="text-gray-600">
                Track expenses, set budgets, and get insights on your spending habits all in one place.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Expense categorization</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Budget alerts</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Financial insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshots Section */}
      <AppStoreScreenshots />

      {/* App Benefits */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose iMe?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our app stands out from the competition with these unique benefits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-[hsl(100,40%,90%)] p-2 mr-3">
                  <Shield className="h-5 w-5 text-[hsl(100,40%,40%)]" />
                </div>
                <h3 className="font-semibold text-lg">Privacy First</h3>
              </div>
              <p className="text-gray-600">
                Your data stays on your device. We don't collect, share, or sell your personal information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-green-100 p-2 mr-3">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">AI-Powered</h3>
              </div>
              <p className="text-gray-600">
                Smart recommendations that learn from your habits and help you optimize your daily routine.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-purple-100 p-2 mr-3">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">Premium Design</h3>
              </div>
              <p className="text-gray-600">
                Beautiful, intuitive interface designed for clarity and ease of use across all devices.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-yellow-100 p-2 mr-3">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg">Fast Performance</h3>
              </div>
              <p className="text-gray-600">
                Optimized for speed and efficiency, even on older devices. Your data, instantly.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-red-100 p-2 mr-3">
                  <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg">Advanced Security</h3>
              </div>
              <p className="text-gray-600">
                Your sensitive data is protected with industry-leading encryption and security measures.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-indigo-100 p-2 mr-3">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg">24/7 Support</h3>
              </div>
              <p className="text-gray-600">
                Our dedicated support team is always available to help with any questions or issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their daily routines with iMe
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 relative">
              <div className="absolute -top-4 left-6 text-blue-500 text-5xl">"</div>
              <div className="pt-4">
                <p className="text-gray-700 mb-4">
                  iMe has completely changed how I manage my day. I've never been more organized or productive!
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-200 mr-3 flex items-center justify-center">
                    <span className="text-blue-700 font-medium">SJ</span>
                  </div>
                  <div>
                    <div className="font-medium">Sarah J.</div>
                    <div className="text-xs text-gray-500">Entrepreneur</div>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 relative">
              <div className="absolute -top-4 left-6 text-green-500 text-5xl">"</div>
              <div className="pt-4">
                <p className="text-gray-700 mb-4">
                  The health tracking features have helped me build better habits. I've never drunk so much water!
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-200 mr-3 flex items-center justify-center">
                    <span className="text-green-700 font-medium">MT</span>
                  </div>
                  <div>
                    <div className="font-medium">Michael T.</div>
                    <div className="text-xs text-gray-500">Fitness Coach</div>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 relative">
              <div className="absolute -top-4 left-6 text-purple-500 text-5xl">"</div>
              <div className="pt-4">
                <p className="text-gray-700 mb-4">
                  I've tried many apps, but iMe is the only one that combines all aspects of life management so well.
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-200 mr-3 flex items-center justify-center">
                    <span className="text-purple-700 font-medium">RL</span>
                  </div>
                  <div>
                    <div className="font-medium">Rebecca L.</div>
                    <div className="text-xs text-gray-500">Product Manager</div>
                  </div>
                  <div className="ml-auto flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-[hsl(100,40%,50%)] to-[hsl(100,40%,30%)] text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Daily Routine?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-[hsl(100,60%,95%)]">
            Download iMe today and join thousands of users who have simplified their lives,
            improved their health, and taken control of their finances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[hsl(100,40%,40%)] hover:bg-[hsl(100,40%,98%)] px-6 py-3 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.02-3.16-.8-1.15-.85-2.26-.87-3.38 0-1.56 1.22-2.38 1.02-3.28.07-5.72-6.2-3.11-15.52 4.29-15.5 1.99.01 3.35 1.12 4.42 1.14 1.06.02 3.06-1.39 5.26-.59.88.31 3.31 1.28 4.85 4.68-4.48 2.58-3.85 8.83.35 10.72-1.43 2.78-3.17 4.3-5.35 2.28-1.07-1.01-2.1-1-3 0m-3.75-18a4.27 4.27 0 01-1 3.28 4.2 4.2 0 01-3 1.36 4.35 4.35 0 013.1-4.62 4.59 4.59 0 111.9-.02z"/>
              </svg>
              <div>
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold -mt-1">App Store</div>
              </div>
            </button>
            <button className="bg-white text-[hsl(100,40%,40%)] hover:bg-[hsl(100,40%,98%)] px-6 py-3 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.2 13.09l8.9 5.16c.49.29 1.31.29 1.81 0l8.9-5.16c.42-.26.42-.91 0-1.16l-8.9-5.16c-.49-.28-1.3-.28-1.81 0L3.2 11.93c-.43.25-.43.9 0 1.16M5 15v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V15l-3 0m10 0h3v3.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V15m3-10v8h2V6c0-1.14-.95-2.06-2.11-2-1.05.06-1.89.95-1.89 2m-18 8h2V5c0-1.1.9-2 2-2h10c0-.57-.43-1.05-.99-1.11L5.03 2C3.91 2.03 3 2.98 3 4.11v8.89z"/>
              </svg>
              <div>
                <div className="text-xs">GET IT ON</div>
                <div className="text-sm font-semibold -mt-1">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-[hsl(100,40%,50%)] rounded-full p-2 mr-2">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">iMe</h1>
              </div>
              <p className="text-sm mb-4">
                Your all-in-one personal management platform for scheduling, health tracking, finance monitoring, and more.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Reviews</a></li>
                <li><a href="#" className="hover:text-white">Download</a></li>
                <li><a href="#" className="hover:text-white">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Report a Bug</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>© 2025 iMe App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppStorePage;