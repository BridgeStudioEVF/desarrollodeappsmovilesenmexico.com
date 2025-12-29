import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/services/blogService";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import BlogGrid from "@/components/BlogGrid";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";


const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticles(),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    document.getElementById("blog-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Desarrollo de Apps Móviles en México | Expertos en iOS, Android y React Native"
        description="Descubre las mejores prácticas, tendencias y soluciones para el desarrollo de aplicaciones móviles en México. Guías especializadas, casos de éxito y recursos para transformar tu negocio."
        type="website"
        keywords={["desarrollo apps moviles mexico", "aplicaciones moviles iOS", "desarrollo android mexico", "react native mexico", "costo app movil", "desarrollo software mexico", "apps empresariales", "transformacion digital mexico"]}
      />
      <Header />

      <main>
        <Hero onSearch={handleSearch} searchQuery={searchQuery} />

        {/* Nueva sección de Stats */}
        <Stats />

        <div id="blog-section" className="container">
          <div className="grid gap-8 lg:grid-cols-4 lg:gap-12">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3">
              <BlogGrid searchQuery={searchQuery} posts={posts} isLoading={isLoading} />
            </div>

            {/* Sidebar - 1 column */}
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
