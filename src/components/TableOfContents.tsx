import { ArticleSection } from "@/types/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
    sections: ArticleSection[];
}

const TableOfContents = ({ sections }: TableOfContentsProps) => {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0% 0% -80% 0%" }
        );

        const headings = document.querySelectorAll("h2, h3");
        headings.forEach((heading) => observer.observe(heading));

        return () => {
            headings.forEach((heading) => observer.unobserve(heading));
        };
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Offset for sticky header
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    // Helper to flatten sections for the link list if needed, 
    // but here we can just render the top level or nested.
    // For simplicity and typical blog sidebars, we'll render up to 2 levels.

    return (
        <nav className="space-y-4">
            <h3 className="font-semibold text-foreground mb-4">Tabla de Contenidos</h3>
            <ul className="space-y-2 text-sm">
                {sections.map((section, index) => {
                    const id = `section-${index}`; // We need to ensure these IDs exist in the rendered content
                    return (
                        <li key={index}>
                            <a
                                href={`#${id}`}
                                onClick={(e) => scrollToSection(e, id)}
                                className={cn(
                                    "block text-muted-foreground hover:text-primary transition-colors border-l-2 pl-4 -ml-px",
                                    activeId === id ? "border-primary text-primary font-medium" : "border-transparent"
                                )}
                            >
                                {section.heading}
                            </a>
                            {section.subsections && (
                                <ul className="mt-2 ml-4 space-y-2">
                                    {section.subsections.map((sub, subIndex) => {
                                        const subId = `section-${index}-${subIndex}`;
                                        return (
                                            <li key={subIndex}>
                                                <a
                                                    href={`#${subId}`}
                                                    onClick={(e) => scrollToSection(e, subId)}
                                                    className={cn(
                                                        "block text-muted-foreground hover:text-primary transition-colors border-l-2 pl-4 -ml-px",
                                                        activeId === subId ? "border-primary text-primary font-medium" : "border-transparent"
                                                    )}
                                                >
                                                    {sub.heading}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default TableOfContents;
