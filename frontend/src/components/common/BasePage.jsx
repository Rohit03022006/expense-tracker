import React from "react";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiBarChart2,
  FiCreditCard,
  FiTarget,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

const BasePage = () => {
  const heroImageSrc = "/hero-illustration.png";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
        <div className="flex items-center text-info font-bold text-xl">
          <FiDollarSign className="mr-2 text-2xl" /> ExpenseTracker
        </div>
        <div className="flex gap-4">
           <Link to="/login" className="px-4 py-2 font-medium text-text-secondary hover:text-text-primary">Login</Link>
           <Link to="/register" className="px-4 py-2 bg-info text-white rounded-lg hover:bg-info-dark">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      {/* Added 'relative' and 'overflow-hidden' to constrain the absolute image */}
      <section className="relative flex-grow flex items-center justify-center px-4 py-1 lg:py-1 overflow-hidden">
        
        {/* Main Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Column: Text & CTA */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-info/10 text-info text-xs font-semibold tracking-wide uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-info mr-2 animate-pulse"></span>
              Smart Financial Management
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight">
              Take Control of <br /> Your{" "}
              <div className="relative inline-block">
                <span className="uppercase font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-700">
                  Finances
                </span>
                {/* Curved underline */}
                <svg
                  className="absolute left-0 -bottom-4 w-full"
                  viewBox="0 0 200 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10 C50 20, 150 0, 198 10"
                    stroke="url(#grad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#1d4ed8" />
                      <stop offset="1" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Track your income, monitor expenses, and manage your budget all in
              one place. Join thousands of users achieving financial freedom
              today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-info rounded-xl shadow-lg shadow-info/25 hover:bg-info-dark transform hover:-translate-y-1 transition-all duration-200"
              >
                Get Started Free
                <FiArrowRight className="ml-2" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text-primary bg-card border-2 border-border rounded-xl hover:bg-border/50 transform hover:-translate-y-1 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>

            {/* Social Proof / Trust Indicators */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-text-secondary opacity-80">
              <div className="flex items-center">
                <FiCheck className="text-success mr-2" /> No credit card
                required
              </div>
              <div className="flex items-center gap-2 font-medium">
                <FiCheck className="text-success" />
                <span>PDF data export</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <FiCheck className="text-success" />
                <span>Multi-device sync</span>
              </div>
            </div>
          </div>
          
          {/* Right Column: Empty div to maintain grid structure if needed, 
              though strictly not necessary since the image is absolute. 
              Keeping it ensures the text column stays 50% width on large screens. */}
          <div className="hidden lg:block"></div>
        </div>

        {/* Background Illustration Container 
            Placed outside the grid column but inside the section.
            Uses absolute positioning to sit behind the content.
        */}
        <div className="absolute top-0 right-0 h-full w-[55%] hidden lg:block pointer-events-none select-none z-0">
          <div className="relative h-full w-full">
            <img
              src={heroImageSrc} 
              alt=""
              className="h-full w-full object-cover object-left opacity-90 mix-blend-multiply"
              style={{
                maskImage:
                  "linear-gradient(to left, black 20%, transparent 90%)",
                WebkitMaskImage:
                  "linear-gradient(to left, black 20%, transparent 90%)",
              }}
            />
            {/* Soft white gradient at bottom to blend with next section */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          </div>
        </div>

      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-card/30 border-t border-border/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">
              Everything you need
            </h2>
            <p className="text-text-secondary mt-4">
              Powerful features to help you grow your wealth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
              <div className="w-14 h-14 bg-info/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiBarChart2 className="text-3xl text-info" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Visual Reports
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Get detailed insights with beautiful interactive charts and
                graphs to understand where your money goes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
              <div className="w-14 h-14 bg-income/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiCreditCard className="text-3xl text-income" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Budget Tracking
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Set monthly budgets for different categories and monitor your
                spending limits in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border group">
              <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FiTarget className="text-3xl text-warning" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Financial Goals
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Create savings pots for vacations, emergencies, or new purchases
                and track your progress.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BasePage;