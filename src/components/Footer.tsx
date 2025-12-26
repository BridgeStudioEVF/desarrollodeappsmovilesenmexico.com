import { Link } from "react-router-dom";
import { Smartphone, Twitter, Linkedin, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta-gradient">
                <Smartphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-secondary-foreground">
                Desarrollo de Apps Móviles
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Tu fuente confiable de información sobre desarrollo de apps móviles, programación iOS y Android, y software a la medida en México.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-secondary-foreground">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {[
                { name: "Blog", href: "/" },
                { name: "Servicios", href: "/servicios" },
                { name: "Contacto", href: "/contacto" },
                { name: "Sobre Nosotros", href: "/sobre-nosotros" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold text-secondary-foreground">Legal</h3>
            <ul className="space-y-3">
              {[
                { name: "Aviso de Privacidad", href: "/privacidad" },
                { name: "Términos y Condiciones", href: "/terminos" },
                { name: "Política de Cookies", href: "/cookies" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Desarrollo de Apps Móviles. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Un proyecto impulsado por{" "}
            <a
              href="https://bridgestudio.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent transition-colors hover:underline"
            >
              Bridge Studio
            </a>{" "}
            - Agencia de Software
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
