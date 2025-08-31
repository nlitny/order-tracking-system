"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  CheckCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Real-time Order Tracking",
      description:
        "Track your orders from queue to completion with instant status updates",
      icon: "📊",
      color: "from-[#27445D] to-[#497D74]",
    },
    {
      title: "Media Management",
      description:
        "Upload, view, and download photos, videos, and PDF reports seamlessly",
      icon: "📱",
      color: "from-[#497D74] to-[#71BBB2]",
    },
    {
      title: "Instant Notifications",
      description: "Get notified immediately when your order status changes",
      icon: "🔔",
      color: "from-[#71BBB2] to-[#EFE9D5]",
    },
    {
      title: "Complete Order History",
      description: "Access all your past orders and their detailed information",
      icon: "📚",
      color: "from-[#EFE9D5] to-[#27445D]",
    },
  ];

  const techStack = {
    frontend: [
      { name: "Next.js", description: "React framework with SSR/CSR" },
      { name: "TypeScript", description: "Type-safe development" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "Material-UI", description: "React component library" },
      { name: "Axios", description: "HTTP client for API calls" },
    ],
    backend: [
      { name: "Express.js", description: "Node.js web framework" },
      { name: "PostgreSQL", description: "Relational database" },
      { name: "REST API", description: "API architecture" },
    ],
    infrastructure: [
      { name: "Docker", description: "Containerized deployment" },
      { name: "Cloudinary", description: "Media storage & optimization" },
    ],
  };

  const orderFlow = [
    {
      step: 1,
      title: "Customer Registration",
      description: "Sign up and access your personal dashboard",
      status: "queue",
      icon: "👤",
    },
    {
      step: 2,
      title: "Place Order",
      description: "Submit your research request with specific requirements",
      status: "queue",
      icon: "📝",
    },
    {
      step: 3,
      title: "Queue Processing",
      description: "Order enters the queue awaiting staff review",
      status: "queue",
      icon: "⏳",
    },
    {
      step: 4,
      title: "In Progress",
      description: "Staff begins working on your order with live updates",
      status: "progress",
      icon: "🔄",
    },
    {
      step: 5,
      title: "Completion",
      description: "Receive your completed order with all media files",
      status: "completed",
      icon: "✅",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFE9D5] via-[#71BBB2] to-[#27445D]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#27445D]/90"></div>
        <div
          className={`relative container mx-auto px-6 py-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-[#71BBB2]/20 rounded-full text-[#EFE9D5] mb-8 backdrop-blur-sm">
              <span className="text-sm font-medium">
                ✨ Professional Order Management System
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-[#EFE9D5] mb-6 leading-tight">
              Order Status
              <span className="block bg-gradient-to-r from-[#71BBB2] to-[#EFE9D5] bg-clip-text text-transparent">
                Tracking System
              </span>
            </h1>

            <p className="text-xl text-[#EFE9D5]/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive solution for managing customer orders with
              real-time tracking, media management, and seamless notification
              system. From queue to completion, track every step of your
              research orders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="group">
                <button className="px-8 py-4 bg-gradient-to-r from-[#71BBB2] to-[#497D74] text-[#27445D] font-semibold rounded-xl shadow-2xl hover:shadow-[#71BBB2]/25 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  Start Your Journey
                  <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/dashboard" className="group">
                <button className="px-8 py-4 border-2 border-[#EFE9D5]/30 text-[#EFE9D5] font-semibold rounded-xl hover:bg-[#EFE9D5]/10 transition-all duration-300 flex items-center gap-2">
                  <PlayCircleIcon className="w-5 h-5" />
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#71BBB2]/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-[#497D74]/20 rounded-full animate-bounce"></div>
      </div>

      {/* Order Flow Section */}
      <section className="py-20 bg-[#EFE9D5]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#27445D] mb-4">
              How It Works
            </h2>
            <p className="text-[#497D74] text-lg max-w-2xl mx-auto">
              Follow the complete journey of your order from initial request to
              final delivery
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#71BBB2] to-[#27445D] hidden md:block"></div>

            {orderFlow.map((item, index) => (
              <div
                key={index}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                  }`}
                >
                  <div
                    className={`p-6 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl ${
                      item.status === "queue"
                        ? "bg-gradient-to-r from-[#EFE9D5] to-white border-l-4 border-[#71BBB2]"
                        : item.status === "progress"
                        ? "bg-gradient-to-r from-[#71BBB2]/10 to-[#497D74]/10 border-l-4 border-[#497D74]"
                        : "bg-gradient-to-r from-[#27445D]/10 to-[#497D74]/10 border-l-4 border-[#27445D]"
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="text-xl font-bold text-[#27445D]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[#497D74]">{item.description}</p>
                  </div>
                </div>

                <div className="hidden md:flex w-12 h-12 bg-gradient-to-r from-[#71BBB2] to-[#497D74] rounded-full items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  {item.step}
                </div>

                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-[#27445D] to-[#497D74]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#EFE9D5] mb-4">
              Core Features
            </h2>
            <p className="text-[#EFE9D5]/80 text-lg max-w-2xl mx-auto">
              Powerful features designed to streamline your order management
              experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeFeature === index
                    ? "bg-[#EFE9D5] text-[#27445D] shadow-2xl"
                    : "bg-[#EFE9D5]/10 text-[#EFE9D5] hover:bg-[#EFE9D5]/20"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p
                  className={
                    activeFeature === index
                      ? "text-[#497D74]"
                      : "text-[#EFE9D5]/70"
                  }
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-[#71BBB2]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#27445D] mb-4">
              Technology Stack
            </h2>
            <p className="text-[#27445D]/80 text-lg max-w-2xl mx-auto">
              Built with modern technologies for optimal performance and
              scalability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#EFE9D5] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#27445D] mb-6 flex items-center gap-2">
                <span className="text-3xl">🎨</span>
                Frontend
              </h3>
              {techStack.frontend.map((tech, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-[#71BBB2]/20 last:border-0"
                >
                  <span className="font-medium text-[#27445D]">
                    {tech.name}
                  </span>
                  <span className="text-sm text-[#497D74]">
                    {tech.description}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#27445D] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#EFE9D5] mb-6 flex items-center gap-2">
                <span className="text-3xl">⚙️</span>
                Backend
              </h3>
              {techStack.backend.map((tech, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-[#71BBB2]/20 last:border-0"
                >
                  <span className="font-medium text-[#EFE9D5]">
                    {tech.name}
                  </span>
                  <span className="text-sm text-[#71BBB2]">
                    {tech.description}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#497D74] to-[#27445D] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#EFE9D5] mb-6 flex items-center gap-2">
                <span className="text-3xl">☁️</span>
                Infrastructure
              </h3>
              {techStack.infrastructure.map((tech, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-[#71BBB2]/20 last:border-0"
                >
                  <span className="font-medium text-[#EFE9D5]">
                    {tech.name}
                  </span>
                  <span className="text-sm text-[#EFE9D5]/80">
                    {tech.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tailwind CSS Highlight */}
      <section className="py-20 bg-gradient-to-r from-[#EFE9D5] to-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#27445D] to-[#497D74] rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-[#EFE9D5] mb-4">
                Crafted with Tailwind CSS
              </h2>
              <p className="text-[#EFE9D5]/90 text-lg mb-6">
                This entire landing page showcases the power of Tailwind CSS
                with custom color themes, responsive design, and stunning visual
                effects. Every element is carefully crafted using utility-first
                classes for optimal performance and maintainability.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-[#EFE9D5]/10 rounded-lg p-4">
                  <span className="block font-semibold text-[#71BBB2]">
                    Responsive Design
                  </span>
                  <span className="text-[#EFE9D5]/70">
                    Mobile-first approach
                  </span>
                </div>
                <div className="bg-[#EFE9D5]/10 rounded-lg p-4">
                  <span className="block font-semibold text-[#71BBB2]">
                    Custom Theme
                  </span>
                  <span className="text-[#EFE9D5]/70">
                    Brand-specific colors
                  </span>
                </div>
                <div className="bg-[#EFE9D5]/10 rounded-lg p-4">
                  <span className="block font-semibold text-[#71BBB2]">
                    Performance
                  </span>
                  <span className="text-[#EFE9D5]/70">Optimized CSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#27445D]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[#EFE9D5] mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-[#EFE9D5]/80 text-xl mb-8">
              Join thousands of satisfied customers who trust our order
              management system for their research and project needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard" className="group">
                <button className="px-10 py-4 bg-gradient-to-r from-[#71BBB2] to-[#EFE9D5] text-[#27445D] font-bold text-lg rounded-xl shadow-2xl hover:shadow-[#71BBB2]/25 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                  Launch Dashboard
                  <ChevronRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>

              <div className="flex items-center gap-2 text-[#EFE9D5]/60 text-sm">
                <CheckCircleIcon className="w-5 h-5 text-[#71BBB2]" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#EFE9D5] border-t border-[#71BBB2]/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#27445D] font-bold text-xl mb-4 md:mb-0">
              Order Tracking System
            </div>
            <div className="text-[#497D74] text-sm">
              © 2025 Built with Next.js, TypeScript & Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
