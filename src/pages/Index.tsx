import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BlogGrid from "@/components/BlogGrid";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Scroll to blog section
    document.getElementById("blog-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero onSearch={handleSearch} />

        <div id="blog-section" className="container">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <BlogGrid searchQuery={searchQuery} />
            </div>

            {/* Sidebar */}
            <div className="animate-slide-in-right lg:sticky lg:top-24 lg:self-start">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
