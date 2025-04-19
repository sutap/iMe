import React from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface Screenshot {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  featureHighlight: string;
}

// Sample screenshots data
const screenshots: Screenshot[] = [
  {
    id: 1,
    title: "Dashboard Overview",
    description: "View all your important information at a glance with our intuitive dashboard",
    imageUrl: "/screenshots/dashboard.png", // Will be generated dynamically
    featureHighlight: "Centralized Information Hub"
  },
  {
    id: 2,
    title: "Health Tracking",
    description: "Monitor your steps, water intake, and sleep patterns to maintain a healthy lifestyle",
    imageUrl: "/screenshots/health.png", // Will be generated dynamically
    featureHighlight: "Comprehensive Health Metrics"
  },
  {
    id: 3,
    title: "Finance Management",
    description: "Keep track of your expenses, income, and budget goals all in one place",
    imageUrl: "/screenshots/finance.png", // Will be generated dynamically
    featureHighlight: "Smart Financial Planning"
  },
  {
    id: 4,
    title: "Schedule Planning",
    description: "Never miss an important meeting or event with our powerful scheduling tools",
    imageUrl: "/screenshots/schedule.png", // Will be generated dynamically
    featureHighlight: "Effortless Time Management"
  },
  {
    id: 5,
    title: "Smart Recommendations",
    description: "Receive personalized suggestions to optimize your daily routine",
    imageUrl: "/screenshots/recommendations.png", // Will be generated dynamically
    featureHighlight: "AI-Powered Insights"
  }
];

// Component to display a device frame around the screenshot for better presentation
const DeviceFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto w-full max-w-[272px] rounded-[36px] border-[10px] border-gray-800 bg-gray-800 shadow-xl">
      <div className="absolute top-0 z-10 w-full h-6 bg-gray-800 rounded-t-lg"></div>
      <div className="overflow-hidden rounded-[22px] bg-white h-[550px]">
        {children}
      </div>
      <div className="absolute bottom-2 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full border-2 border-gray-700 bg-gray-800"></div>
    </div>
  );
};

// This component generates dynamic mockup screenshots based on the feature
const DynamicScreenshot = ({ screenshot }: { screenshot: Screenshot }) => {
  // We'll use some placeholder content based on the screenshot type
  let content;
  
  switch (screenshot.id) {
    case 1: // Dashboard
      content = (
        <div className="h-full bg-gray-50">
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-400 rounded-full p-2 mr-2">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">iMe</h1>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <span className="text-sm font-medium text-blue-700">AM</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-sm text-gray-500 mb-1">Today's Events</div>
                <div className="text-2xl font-bold">3</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-sm text-gray-500 mb-1">Steps</div>
                <div className="text-2xl font-bold">7,234</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-sm text-gray-500 mb-1">Water</div>
                <div className="text-2xl font-bold">1.2L</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-sm text-gray-500 mb-1">Sleep</div>
                <div className="text-2xl font-bold">7.5h</div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Upcoming Events</h3>
              <div className="bg-white rounded-lg shadow p-3 mb-2">
                <div className="text-sm font-medium">Team Standup</div>
                <div className="text-xs text-gray-500">09:00 AM - 09:30 AM</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3 mb-2">
                <div className="text-sm font-medium">Doctor Appointment</div>
                <div className="text-xs text-gray-500">11:00 AM - 12:00 PM</div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Financial Summary</h3>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Monthly Budget</span>
                  <span className="text-sm font-medium">$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Spent</span>
                  <span className="text-sm font-medium">$1,234</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 h-2.5 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    case 2: // Health
      content = (
        <div className="h-full bg-gray-50">
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">Health Tracking</h1>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <span className="text-sm font-medium text-blue-700">AM</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg shadow p-3 col-span-2">
                <div className="text-sm text-gray-500 mb-1">Daily Steps</div>
                <div className="text-2xl font-bold">7,234</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-600 h-2.5 rounded-full w-3/4"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Goal: 10,000 steps</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-sm text-gray-500 mb-1">Water Intake</div>
                <div className="text-2xl font-bold">1.2L</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 h-2.5 rounded-full w-1/2"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Goal: 2.5L</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-sm text-gray-500 mb-1">Sleep</div>
                <div className="text-2xl font-bold">7.5h</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-indigo-600 h-2.5 rounded-full w-4/5"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Goal: 8h</div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Weekly Summary</h3>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex justify-between items-end h-32 mb-2">
                  {[60, 85, 45, 70, 90, 50, 75].map((height, i) => (
                    <div key={i} className="w-6 bg-blue-400 rounded-t-sm" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Activity Suggestions</h3>
              <div className="bg-white rounded-lg shadow p-3 mb-2">
                <div className="text-sm font-medium">Evening Walk</div>
                <div className="text-xs text-gray-500">Complete your step goal with a 20 minute walk</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-sm font-medium">Hydration Reminder</div>
                <div className="text-xs text-gray-500">You're 1.3L away from your daily water goal</div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    case 3: // Finance
      content = (
        <div className="h-full bg-gray-50">
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">Finance Manager</h1>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <span className="text-sm font-medium text-blue-700">AM</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="text-lg font-medium mb-2">Monthly Budget</div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Total Budget</span>
                <span className="text-sm font-medium">$2,500.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Spent</span>
                <span className="text-sm font-medium">$1,234.56</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div className="bg-blue-600 h-2.5 rounded-full w-1/2"></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">$1,265.44 remaining</span>
                <span className="text-gray-500">49% spent</span>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Recent Transactions</h3>
              <div className="bg-white rounded-lg shadow">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm font-medium">Grocery Store</div>
                      <div className="text-xs text-gray-500">Apr 18</div>
                    </div>
                    <div className="text-sm font-medium text-red-600">-$65.40</div>
                  </div>
                </div>
                <div className="p-3 border-b border-gray-100">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm font-medium">Coffee Shop</div>
                      <div className="text-xs text-gray-500">Apr 17</div>
                    </div>
                    <div className="text-sm font-medium text-red-600">-$4.50</div>
                  </div>
                </div>
                <div className="p-3 border-b border-gray-100">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm font-medium">Paycheck</div>
                      <div className="text-xs text-gray-500">Apr 15</div>
                    </div>
                    <div className="text-sm font-medium text-green-600">+$1,250.00</div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm font-medium">Electric Bill</div>
                      <div className="text-xs text-gray-500">Apr 14</div>
                    </div>
                    <div className="text-sm font-medium text-red-600">-$87.33</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Spending by Category</h3>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Groceries</span>
                  </div>
                  <span className="text-sm">32%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Bills</span>
                  </div>
                  <span className="text-sm">28%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm">Entertainment</span>
                  </div>
                  <span className="text-sm">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Other</span>
                  </div>
                  <span className="text-sm">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    case 4: // Schedule
      content = (
        <div className="h-full bg-gray-50">
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">Schedule</h1>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <span className="text-sm font-medium text-blue-700">AM</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-white rounded-lg shadow p-3 mb-4">
              <div className="flex justify-between mb-3">
                <div className="text-center">
                  <div className="text-xs text-gray-500">MON</div>
                  <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center mx-auto">18</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">TUE</div>
                  <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center mx-auto">19</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">WED</div>
                  <div className="h-7 w-7 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto">20</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">THU</div>
                  <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center mx-auto">21</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">FRI</div>
                  <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center mx-auto">22</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">SAT</div>
                  <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center mx-auto">23</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">SUN</div>
                  <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center mx-auto">24</div>
                </div>
              </div>
              <div className="text-sm font-medium">April 20, 2025</div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Today's Events</h3>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
                <div className="relative pl-10 pb-6">
                  <div className="absolute left-3 w-3 h-3 bg-blue-500 rounded-full -translate-x-1.5 mt-1.5"></div>
                  <div className="text-xs text-gray-500 mb-1">09:00 AM - 09:30 AM</div>
                  <div className="bg-white rounded-lg shadow p-3">
                    <div className="text-sm font-medium">Team Standup</div>
                    <div className="text-xs text-gray-500 mt-1">Virtual Meeting • 15 attendees</div>
                  </div>
                </div>
                <div className="relative pl-10 pb-6">
                  <div className="absolute left-3 w-3 h-3 bg-green-500 rounded-full -translate-x-1.5 mt-1.5"></div>
                  <div className="text-xs text-gray-500 mb-1">11:00 AM - 12:00 PM</div>
                  <div className="bg-white rounded-lg shadow p-3">
                    <div className="text-sm font-medium">Doctor Appointment</div>
                    <div className="text-xs text-gray-500 mt-1">City Medical Center • 123 Main St</div>
                  </div>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-3 w-3 h-3 bg-purple-500 rounded-full -translate-x-1.5 mt-1.5"></div>
                  <div className="text-xs text-gray-500 mb-1">02:30 PM - 04:00 PM</div>
                  <div className="bg-white rounded-lg shadow p-3">
                    <div className="text-sm font-medium">Project Planning</div>
                    <div className="text-xs text-gray-500 mt-1">Conference Room B • 3 attendees</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Upcoming Events</h3>
              <div className="bg-white rounded-lg shadow p-3 mb-2">
                <div className="text-xs text-gray-500 mb-1">TOMORROW</div>
                <div className="text-sm font-medium">Weekly Review</div>
                <div className="text-xs text-gray-500">10:00 AM - 11:00 AM</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <div className="text-xs text-gray-500 mb-1">FRIDAY, APR 22</div>
                <div className="text-sm font-medium">Team Lunch</div>
                <div className="text-xs text-gray-500">12:30 PM - 02:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    case 5: // Recommendations
      content = (
        <div className="h-full bg-gray-50">
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">Recommendations</h1>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <span className="text-sm font-medium text-blue-700">AM</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Personalized For You</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden mb-3">
                <div className="h-32 bg-blue-100 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-blue-400 flex items-center justify-center">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium">5-Minute Meditation</div>
                  <div className="text-xs text-gray-500 mb-2">Reduce stress and improve focus with this quick meditation</div>
                  <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded">Start Now</button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden mb-3">
                <div className="h-32 bg-green-100 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-green-400 flex items-center justify-center">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium">Evening Walk Reminder</div>
                  <div className="text-xs text-gray-500 mb-2">You're just 1,500 steps away from your daily goal</div>
                  <button className="text-xs bg-green-500 text-white px-3 py-1 rounded">Set Reminder</button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-32 bg-purple-100 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-purple-400 flex items-center justify-center">
                    <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium">Budget Alert</div>
                  <div className="text-xs text-gray-500 mb-2">You've reached 80% of your dining out budget for the month</div>
                  <button className="text-xs bg-purple-500 text-white px-3 py-1 rounded">Review Budget</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    default:
      content = (
        <div className="h-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold mb-2">iMe</div>
            <div className="text-sm text-gray-500">Your personal assistant app</div>
          </div>
        </div>
      );
  }

  return (
    <div className="h-full">
      {content}
    </div>
  );
};

export function AppStoreScreenshots() {
  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">App Preview</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take a sneak peek at what iMe has to offer. Your all-in-one personal assistant for managing your schedule, health, finances, and more.
          </p>
        </div>

        <Carousel className="mx-auto max-w-xs sm:max-w-md md:max-w-4xl">
          <CarouselContent>
            {screenshots.map((screenshot) => (
              <CarouselItem key={screenshot.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <DeviceFrame>
                        <DynamicScreenshot screenshot={screenshot} />
                      </DeviceFrame>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white p-4 pt-12">
                        <div className="text-xs font-semibold text-blue-300">
                          {screenshot.featureHighlight}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{screenshot.title}</h3>
                        <p className="text-xs text-gray-200">{screenshot.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex">
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        </Carousel>

        <div className="mt-10 text-center">
          <h3 className="text-xl font-semibold mb-3">Ready to Simplify Your Life?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            iMe brings together all aspects of your daily routine in one beautiful, intuitive application.
            Download now and experience the difference.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-white px-6 py-2 rounded-lg flex items-center">
              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.02-3.16-.8-1.15-.85-2.26-.87-3.38 0-1.56 1.22-2.38 1.02-3.28.07-5.72-6.2-3.11-15.52 4.29-15.5 1.99.01 3.35 1.12 4.42 1.14 1.06.02 3.06-1.39 5.26-.59.88.31 3.31 1.28 4.85 4.68-4.48 2.58-3.85 8.83.35 10.72-1.43 2.78-3.17 4.3-5.35 2.28-1.07-1.01-2.1-1-3 0m-3.75-18a4.27 4.27 0 01-1 3.28 4.2 4.2 0 01-3 1.36 4.35 4.35 0 013.1-4.62 4.59 4.59 0 111.9-.02z"/>
              </svg>
              <div>
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold -mt-1">App Store</div>
              </div>
            </button>
            <button className="bg-black text-white px-6 py-2 rounded-lg flex items-center">
              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.2 13.09l8.9 5.16c.49.29 1.31.29 1.81 0l8.9-5.16c.42-.26.42-.91 0-1.16l-8.9-5.16c-.49-.28-1.3-.28-1.81 0L3.2 11.93c-.43.25-.43.9 0 1.16M5 15v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V15l-3 0m10 0h3v3.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V15m3-10v8h2V6c0-1.14-.95-2.06-2.11-2-1.05.06-1.89.95-1.89 2m-18 8h2V5c0-1.1.9-2 2-2h10c0-.57-.43-1.05-.99-1.11L5.03 2C3.91 2.03 3 2.98 3 4.11v8.89z"/>
              </svg>
              <div>
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-semibold -mt-1">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppStoreScreenshots;