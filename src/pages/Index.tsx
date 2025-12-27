import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/services/blogService";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BlogGrid from "@/components/BlogGrid";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";


const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(), // Fetch all to allow client-side filtering without spamming API
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Scroll to blog section
    document.getElementById("blog-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Desarrollo de Apps Móviles en México | Guías, Costos y Expertos 2026"
        description="El blog definitivo sobre desarrollo de aplicaciones móviles, iOS, Android y React Native en México. Aprende estrategias, costos y tendencias con Bridge Studio."
        type="website"
        keywords={["desarrollo de apps moviles", "crear app mexico", "precio app movil", "desarrolladores ios android", "bridge studio", "react native", "flutter", "transformacion digital"]}
      />
      <Header />


      <main>
        <Hero onSearch={handleSearch} searchQuery={searchQuery} />

        <div id="blog-section" className="container">

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <BlogGrid searchQuery={searchQuery} posts={posts} isLoading={isLoading} />
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
