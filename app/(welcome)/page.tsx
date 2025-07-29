"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { MessageSquare, Users, Shield } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLoading(true);
      const timeout = setTimeout(() => {
        router.push("/setup");
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">GH</span>
          </div>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 border-solid" />
        <p className="mt-4 text-gray-400 text-sm">Connecting to Guildhub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Image
              alt="Guildhub logo"
              src="/logo.png"
              width={40}
              height={40}
              className="object-contain rounded-xl"
              priority
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <span className="text-2xl font-bold text-white">Guildhub</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            onClick={() => router.push("/signin")}
          >
            Sign In
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 transition-colors"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent block">
                Guildhub
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with your community, share ideas, and build lasting
              relationships in beautifully designed spaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105"
                onClick={() => router.push("/signup")}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold transition-colors"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-time Chat
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Instant messaging with rich media support, emoji reactions, and
                seamless communication.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Community Spaces
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Create and manage multiple servers with organized channels for
                different topics.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced moderation tools and privacy controls to keep your
                community safe.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-10 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                alt="Guildhub logo"
                src="/logo.png"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-gray-400">
              © 2025 Guildhub. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
