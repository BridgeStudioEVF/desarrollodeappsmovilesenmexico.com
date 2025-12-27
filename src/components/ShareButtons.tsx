import { Facebook, Linkedin, Twitter, Link as LinkIcon, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonsProps {
    title: string;
    url?: string;
}

const ShareButtons = ({ title, url = window.location.href }: ShareButtonsProps) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: "Twitter",
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: "hover:text-[#1DA1F2]",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "hover:text-[#0A66C2]",
        },
        {
            name: "Facebook",
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "hover:text-[#1877F2]",
        },
        {
            name: "Email",
            icon: Mail,
            url: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
            color: "hover:text-foreground",
        },
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Enlace copiado al portapapeles");
        } catch (err) {
            toast.error("Error al copiar el enlace");
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Compartir:</span>
            {shareLinks.map((link) => (
                <Button
                    key={link.name}
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 transition-colors ${link.color}`}
                    asChild
                >
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Share on ${link.name}`}
                    >
                        <link.icon className="h-4 w-4" />
                    </a>
                </Button>
            ))}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-primary transition-colors"
                onClick={copyToClipboard}
                aria-label="Copy link"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default ShareButtons;
