import { useState, useRef, useEffect } from "react";
import { Search, FileText, Tag, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { useNavigate } from "react-router-dom";

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
}

const SearchAutocomplete = ({ onSearch }: SearchAutocompleteProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter posts based on search query
  const filteredPosts = searchQuery.length > 0
    ? blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Get unique categories that match
  const matchingCategories = searchQuery.length > 0
    ? [...new Set(blogPosts
        .filter(post => post.category.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(post => post.category)
      )].slice(0, 3)
    : [];

  // Popular searches
  const popularSearches = ["iOS", "Android", "Flutter", "React Native", "Software a la medida"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setIsOpen(false);
    }
  };

  const handleSelectPost = (slug: string) => {
    navigate(`/blog/${slug}`);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSelectCategory = (category: string) => {
    setSearchQuery(category);
    onSearch?.(category);
    setIsOpen(false);
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    onSearch?.(term);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = filteredPosts.length + matchingCategories.length;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      if (highlightedIndex < matchingCategories.length) {
        handleSelectCategory(matchingCategories[highlightedIndex]);
      } else {
        const postIndex = highlightedIndex - matchingCategories.length;
        if (filteredPosts[postIndex]) {
          handleSelectPost(filteredPosts[postIndex].slug);
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  const showDropdown = isOpen && (searchQuery.length > 0 || filteredPosts.length === 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSearch}
        className="flex w-full flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar artículos sobre desarrollo de apps..."
            className="h-12 w-full rounded-xl border-0 bg-background/95 pl-12 pr-4 text-foreground shadow-lg backdrop-blur placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent sm:h-14"
            autoComplete="off"
          />
        </div>
        <button 
          type="submit" 
          className="h-12 rounded-xl bg-accent px-6 font-semibold text-accent-foreground shadow-lg transition-all hover:bg-accent/90 hover:shadow-xl sm:h-14"
        >
          Buscar
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-background/98 shadow-2xl backdrop-blur-xl sm:right-auto sm:max-w-[calc(100%-100px)]">
          {/* No results state with popular searches */}
          {searchQuery.length > 0 && filteredPosts.length === 0 && matchingCategories.length === 0 ? (
            <div className="p-4">
              <p className="mb-3 text-sm text-muted-foreground">
                No se encontraron resultados para "{searchQuery}"
              </p>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Búsquedas populares
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearch(term)}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {/* Matching Categories */}
              {matchingCategories.length > 0 && (
                <div className="border-b border-border p-2">
                  <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Categorías
                  </p>
                  {matchingCategories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => handleSelectCategory(category)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        highlightedIndex === index
                          ? "bg-accent/20 text-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Tag className="h-4 w-4 text-accent" />
                      <span className="font-medium">{category}</span>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {/* Matching Articles */}
              {filteredPosts.length > 0 && (
                <div className="p-2">
                  <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Artículos
                  </p>
                  {filteredPosts.map((post, index) => {
                    const adjustedIndex = index + matchingCategories.length;
                    return (
                      <button
                        key={post.id}
                        onClick={() => handleSelectPost(post.slug)}
                        className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                          highlightedIndex === adjustedIndex
                            ? "bg-accent/20"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 font-medium text-foreground">
                            {post.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded bg-muted px-1.5 py-0.5">{post.category}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* View all results */}
              {(filteredPosts.length > 0 || matchingCategories.length > 0) && (
                <div className="border-t border-border p-2">
                  <button
                    onClick={handleSearch}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-accent transition-colors hover:bg-muted"
                  >
                    Ver todos los resultados para "{searchQuery}"
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty state - show popular when no query */}
          {searchQuery.length === 0 && (
            <div className="p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Búsquedas populares
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearch(term)}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
