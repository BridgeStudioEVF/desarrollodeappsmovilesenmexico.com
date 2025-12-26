import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, User, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

// Sample article data
const articles: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}> = {
  "guia-completa-desarrollo-apps-moviles-2024": {
    title: "Guía Completa: Desarrollo de Apps Móviles en 2024",
    excerpt: "Todo lo que necesitas saber sobre el desarrollo de apps móviles, desde la planificación hasta el lanzamiento en iOS y Android.",
    content: `
      <h2>Introducción al Desarrollo de Apps Móviles</h2>
      <p>El desarrollo de apps móviles ha evolucionado significativamente en los últimos años. En 2024, las empresas en México buscan cada vez más soluciones de software a la medida que les permitan conectar con sus clientes de manera efectiva.</p>
      
      <p>Ya sea que estés considerando programación iOS con Swift, desarrollo Android con Kotlin, o frameworks multiplataforma como Flutter y React Native, esta guía te proporcionará las bases necesarias para tomar decisiones informadas.</p>

      <h2>Planificación del Proyecto</h2>
      <p>Antes de comenzar el desarrollo de tu aplicación móvil, es crucial definir claramente los objetivos del proyecto. Esto incluye:</p>
      <ul>
        <li>Identificar el público objetivo de tu app</li>
        <li>Definir las funcionalidades principales (MVP)</li>
        <li>Establecer un presupuesto realista</li>
        <li>Elegir la plataforma adecuada (iOS, Android o ambas)</li>
      </ul>

      <h2>Selección de Tecnología</h2>
      <p>La elección entre desarrollo nativo y multiplataforma depende de varios factores. El desarrollo nativo con Swift para iOS y Kotlin para Android ofrece el mejor rendimiento, mientras que frameworks como Flutter y React Native permiten crear aplicaciones para ambas plataformas con una sola base de código.</p>

      <h2>Diseño UX/UI</h2>
      <p>Una interfaz intuitiva es fundamental para el éxito de cualquier aplicación móvil. Siguiendo las guías de diseño de iOS (Human Interface Guidelines) y Android (Material Design), podrás crear experiencias consistentes y atractivas para tus usuarios.</p>

      <h2>Desarrollo y Pruebas</h2>
      <p>El proceso de desarrollo debe incluir ciclos iterativos de desarrollo y pruebas. Es importante realizar pruebas en dispositivos reales y considerar diferentes tamaños de pantalla y versiones del sistema operativo.</p>

      <h2>Lanzamiento y Mantenimiento</h2>
      <p>Publicar tu app en la App Store y Google Play Store requiere seguir sus respectivas guías y políticas. Una vez publicada, el mantenimiento continuo y las actualizaciones regulares son esenciales para mantener a tus usuarios satisfechos.</p>

      <h2>Conclusión</h2>
      <p>El desarrollo de apps móviles es un proceso complejo que requiere planificación, experiencia técnica y un enfoque centrado en el usuario. Si estás buscando desarrollar una aplicación para tu empresa en México, considera trabajar con una agencia especializada como Bridge Studio para obtener los mejores resultados.</p>
    `,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80",
    date: "20 Diciembre 2024",
    readTime: "8 min",
    author: {
      name: "Carlos Mendoza",
      role: "Lead Developer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
    },
  },
  "flutter-vs-react-native-comparativa": {
    title: "Flutter vs React Native: ¿Cuál Elegir para tu App?",
    excerpt: "Comparativa detallada entre los dos frameworks más populares para desarrollo de aplicaciones móviles multiplataforma.",
    content: `
      <h2>Introducción a los Frameworks Multiplataforma</h2>
      <p>El desarrollo de apps móviles multiplataforma se ha convertido en una opción cada vez más popular para empresas que buscan lanzar aplicaciones tanto para iOS como Android sin duplicar esfuerzos. Flutter y React Native son los dos frameworks líderes en este espacio.</p>

      <h2>¿Qué es Flutter?</h2>
      <p>Flutter es un framework de código abierto desarrollado por Google. Utiliza el lenguaje Dart y ofrece un enfoque único con su propio motor de renderizado, lo que permite crear interfaces consistentes en todas las plataformas.</p>
      <ul>
        <li>Desarrollado por Google</li>
        <li>Lenguaje: Dart</li>
        <li>Motor de renderizado propio (Skia)</li>
        <li>Hot Reload para desarrollo rápido</li>
      </ul>

      <h2>¿Qué es React Native?</h2>
      <p>React Native fue creado por Facebook (Meta) y permite desarrollar aplicaciones móviles usando JavaScript y React. Utiliza componentes nativos del sistema operativo, lo que proporciona una experiencia más cercana a las apps nativas.</p>
      <ul>
        <li>Desarrollado por Meta (Facebook)</li>
        <li>Lenguaje: JavaScript/TypeScript</li>
        <li>Componentes nativos del SO</li>
        <li>Gran comunidad y ecosistema</li>
      </ul>

      <h2>Rendimiento</h2>
      <p>Flutter generalmente ofrece mejor rendimiento debido a su compilación a código nativo y su motor de renderizado propio. React Native ha mejorado significativamente con la nueva arquitectura, pero Flutter sigue teniendo ventaja en animaciones complejas.</p>

      <h2>Curva de Aprendizaje</h2>
      <p>Si tu equipo ya conoce JavaScript y React, React Native será más fácil de adoptar. Flutter requiere aprender Dart, pero el lenguaje es sencillo y similar a otros lenguajes orientados a objetos.</p>

      <h2>¿Cuál Elegir?</h2>
      <p>La elección depende de tu equipo y proyecto. Flutter es ideal para apps con interfaces personalizadas y animaciones complejas. React Native es perfecto si ya tienes experiencia con React y necesitas integrar con código nativo existente.</p>

      <h2>Conclusión</h2>
      <p>Ambos frameworks son excelentes opciones para el desarrollo de apps móviles. En Bridge Studio trabajamos con ambas tecnologías para ofrecer la mejor solución según las necesidades de cada proyecto.</p>
    `,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80",
    date: "18 Diciembre 2024",
    readTime: "6 min",
    author: {
      name: "Ana García",
      role: "Mobile Developer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    },
  },
  "costo-desarrollar-app-movil-mexico": {
    title: "Costo de Desarrollar una App Móvil en México",
    excerpt: "Análisis de los factores que influyen en el costo del desarrollo de apps móviles y cómo planificar tu presupuesto de software a la medida.",
    content: `
      <h2>Factores que Determinan el Costo</h2>
      <p>El costo de desarrollar una aplicación móvil en México puede variar significativamente dependiendo de múltiples factores. Entender estos elementos te ayudará a planificar mejor tu presupuesto para software a la medida.</p>

      <h2>Complejidad de la Aplicación</h2>
      <p>Las aplicaciones se clasifican generalmente en tres niveles de complejidad:</p>
      <ul>
        <li><strong>App Simple:</strong> Funcionalidades básicas, sin backend complejo. $150,000 - $400,000 MXN</li>
        <li><strong>App Media:</strong> Backend, autenticación, integraciones. $400,000 - $1,000,000 MXN</li>
        <li><strong>App Compleja:</strong> Múltiples funcionalidades, IA, tiempo real. $1,000,000+ MXN</li>
      </ul>

      <h2>Plataforma (iOS, Android o Ambas)</h2>
      <p>Desarrollar para una sola plataforma (iOS o Android) cuesta menos que desarrollar para ambas. Sin embargo, usar frameworks multiplataforma como Flutter o React Native puede reducir significativamente el costo de desarrollo para múltiples plataformas.</p>

      <h2>Diseño UX/UI</h2>
      <p>Un diseño personalizado y de alta calidad agrega valor a tu aplicación pero también incrementa el costo. Un buen diseño puede aumentar el costo entre 20-30%, pero mejora significativamente la retención de usuarios.</p>

      <h2>Backend y Infraestructura</h2>
      <p>Las aplicaciones que requieren almacenamiento de datos, autenticación de usuarios, o procesamiento en la nube necesitan desarrollo backend adicional, lo cual impacta el presupuesto total.</p>

      <h2>Mantenimiento Continuo</h2>
      <p>Considera que después del lanzamiento, tu app requerirá actualizaciones, corrección de bugs y mejoras. Esto típicamente representa 15-20% del costo inicial anualmente.</p>

      <h2>Recomendaciones</h2>
      <p>Para optimizar tu inversión en desarrollo de apps móviles:</p>
      <ul>
        <li>Define un MVP claro antes de comenzar</li>
        <li>Considera frameworks multiplataforma si necesitas iOS y Android</li>
        <li>Trabaja con una agencia experimentada como Bridge Studio</li>
        <li>Planifica el mantenimiento desde el inicio</li>
      </ul>
    `,
    category: "Business",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    date: "15 Diciembre 2024",
    readTime: "7 min",
    author: {
      name: "Roberto Sánchez",
      role: "Project Manager",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    },
  },
  "mejores-practicas-ux-apps-ios-android": {
    title: "Mejores Prácticas de UX en Apps iOS y Android",
    excerpt: "Descubre cómo diseñar interfaces intuitivas que mejoren la experiencia del usuario en el desarrollo de apps móviles.",
    content: `
      <h2>La Importancia del UX en Apps Móviles</h2>
      <p>La experiencia de usuario (UX) es fundamental para el éxito de cualquier aplicación móvil. Una buena UX puede aumentar la retención de usuarios hasta en un 400% y reducir significativamente las desinstalaciones.</p>

      <h2>Principios de Diseño para iOS</h2>
      <p>Apple define sus Human Interface Guidelines con principios claros:</p>
      <ul>
        <li><strong>Claridad:</strong> El texto debe ser legible, los iconos precisos</li>
        <li><strong>Deferencia:</strong> La UI no debe competir con el contenido</li>
        <li><strong>Profundidad:</strong> Capas visuales que comunican jerarquía</li>
      </ul>

      <h2>Material Design para Android</h2>
      <p>Google promueve Material Design con estos conceptos:</p>
      <ul>
        <li><strong>Material:</strong> Superficies táctiles inspiradas en papel</li>
        <li><strong>Movimiento:</strong> Animaciones con significado</li>
        <li><strong>Diseño adaptable:</strong> Layouts responsivos</li>
      </ul>

      <h2>Navegación Intuitiva</h2>
      <p>La navegación debe ser predecible y consistente. Usa patrones familiares como tabs inferiores, menús hamburguesa, y gestos estándar. Los usuarios no deberían pensar en cómo moverse por tu app.</p>

      <h2>Tiempos de Carga y Feedback</h2>
      <p>Cada acción debe tener feedback visual inmediato. Usa esqueletos de carga, animaciones de progreso, y estados de error claros. Los usuarios abandonan apps que se sienten lentas o no responden.</p>

      <h2>Accesibilidad</h2>
      <p>Diseña para todos los usuarios:</p>
      <ul>
        <li>Contraste suficiente para texto e iconos</li>
        <li>Soporte para lectores de pantalla</li>
        <li>Áreas táctiles de mínimo 44x44 puntos</li>
        <li>Alternativas para contenido visual</li>
      </ul>

      <h2>Testing con Usuarios Reales</h2>
      <p>Realiza pruebas de usabilidad antes del lanzamiento. Observa cómo usuarios reales interactúan con tu app e identifica puntos de fricción que no habías considerado.</p>
    `,
    category: "UX",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&auto=format&fit=crop&q=80",
    date: "12 Diciembre 2024",
    readTime: "5 min",
    author: {
      name: "María López",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
    },
  },
  "programacion-ios-swift-vs-objective-c": {
    title: "Programación iOS: Swift vs Objective-C en 2024",
    excerpt: "¿Cuál lenguaje deberías usar para la programación iOS? Analizamos las ventajas de cada uno para el desarrollo de apps.",
    content: `
      <h2>Historia de la Programación iOS</h2>
      <p>Durante años, Objective-C fue el único lenguaje para desarrollar aplicaciones iOS. En 2014, Apple introdujo Swift, un lenguaje moderno diseñado específicamente para el ecosistema Apple. Hoy, ambos coexisten, pero Swift domina el desarrollo de apps móviles para iOS.</p>

      <h2>Ventajas de Swift</h2>
      <p>Swift se ha convertido en el estándar para la programación iOS por múltiples razones:</p>
      <ul>
        <li><strong>Sintaxis moderna:</strong> Código más limpio y legible</li>
        <li><strong>Seguridad:</strong> Manejo de opcionales que previene crashes</li>
        <li><strong>Rendimiento:</strong> Más rápido que Objective-C en muchos casos</li>
        <li><strong>SwiftUI:</strong> Framework declarativo para crear interfaces</li>
        <li><strong>Playground:</strong> Experimentación interactiva de código</li>
      </ul>

      <h2>¿Cuándo Usar Objective-C?</h2>
      <p>Objective-C sigue siendo relevante en ciertos escenarios:</p>
      <ul>
        <li>Mantenimiento de apps legacy</li>
        <li>Integración con código C/C++ existente</li>
        <li>Proyectos que requieren runtime dinámico</li>
        <li>Librerías antiguas sin versión Swift</li>
      </ul>

      <h2>SwiftUI vs UIKit</h2>
      <p>SwiftUI es el futuro del desarrollo de interfaces en iOS. Ofrece un enfoque declarativo que reduce significativamente la cantidad de código necesario. Sin embargo, UIKit sigue siendo importante para funcionalidades avanzadas y compatibilidad con versiones anteriores de iOS.</p>

      <h2>Aprendiendo Swift en 2024</h2>
      <p>Si estás comenzando en la programación iOS, Swift es definitivamente el camino a seguir. Apple continúa invirtiendo en el lenguaje con mejoras constantes, y la comunidad es muy activa.</p>

      <h2>Recursos Recomendados</h2>
      <ul>
        <li>Swift Playgrounds (app gratuita de Apple)</li>
        <li>Documentación oficial de Apple Developer</li>
        <li>Hacking with Swift (tutoriales gratuitos)</li>
        <li>Stanford CS193p (curso universitario gratuito)</li>
      </ul>

      <h2>Conclusión</h2>
      <p>Para nuevos proyectos de desarrollo de apps móviles en iOS, Swift es la elección correcta. En Bridge Studio utilizamos Swift y SwiftUI para crear aplicaciones modernas, seguras y de alto rendimiento.</p>
    `,
    category: "iOS",
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=1200&auto=format&fit=crop&q=80",
    date: "10 Diciembre 2024",
    readTime: "6 min",
    author: {
      name: "Carlos Mendoza",
      role: "Lead Developer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
    },
  },
  "kotlin-android-guia-inicio-rapido": {
    title: "Kotlin para Android: Guía de Inicio Rápido",
    excerpt: "Aprende los fundamentos de Kotlin para programación Android y crea tu primera aplicación móvil paso a paso.",
    content: `
      <h2>¿Por qué Kotlin para Android?</h2>
      <p>Google declaró Kotlin como el lenguaje preferido para el desarrollo Android en 2019. Desde entonces, la adopción ha crecido exponencialmente. Kotlin ofrece un código más conciso, seguro y expresivo que Java, mientras mantiene interoperabilidad completa.</p>

      <h2>Configurando tu Entorno</h2>
      <p>Para comenzar con el desarrollo de apps móviles Android necesitas:</p>
      <ul>
        <li><strong>Android Studio:</strong> IDE oficial de Google</li>
        <li><strong>JDK:</strong> Java Development Kit (incluido en Android Studio)</li>
        <li><strong>Emulador o dispositivo:</strong> Para probar tus apps</li>
      </ul>

      <h2>Fundamentos de Kotlin</h2>
      <p>Kotlin tiene características que lo hacen ideal para Android:</p>
      <ul>
        <li><strong>Null Safety:</strong> Previene NullPointerExceptions</li>
        <li><strong>Data Classes:</strong> Clases de datos con una línea</li>
        <li><strong>Extension Functions:</strong> Añade funciones a clases existentes</li>
        <li><strong>Coroutines:</strong> Programación asíncrona simplificada</li>
      </ul>

      <h2>Jetpack Compose</h2>
      <p>Jetpack Compose es el toolkit moderno de Android para crear interfaces de usuario. Similar a SwiftUI en iOS, permite crear UIs declarativas con menos código:</p>
      <ul>
        <li>Menos código boilerplate</li>
        <li>Preview en tiempo real</li>
        <li>Integración con Material Design 3</li>
        <li>Animaciones simplificadas</li>
      </ul>

      <h2>Arquitectura Recomendada</h2>
      <p>Google recomienda seguir la arquitectura MVVM con estos componentes:</p>
      <ul>
        <li><strong>ViewModel:</strong> Maneja la lógica de UI</li>
        <li><strong>Repository:</strong> Gestiona fuentes de datos</li>
        <li><strong>Room:</strong> Base de datos local</li>
        <li><strong>Retrofit:</strong> Llamadas a APIs</li>
      </ul>

      <h2>Tu Primera App</h2>
      <p>Comienza con un proyecto simple: una app de lista de tareas. Esto te permitirá practicar conceptos fundamentales como:</p>
      <ul>
        <li>Crear interfaces con Compose</li>
        <li>Manejar estado con ViewModel</li>
        <li>Persistir datos con Room</li>
        <li>Navegación entre pantallas</li>
      </ul>

      <h2>Recursos para Aprender</h2>
      <ul>
        <li>Android Developers (documentación oficial)</li>
        <li>Kotlin Koans (ejercicios interactivos)</li>
        <li>Codelabs de Google</li>
        <li>Cursos en Udacity</li>
      </ul>

      <h2>Conclusión</h2>
      <p>Kotlin y Jetpack Compose son el presente y futuro del desarrollo Android. En Bridge Studio utilizamos estas tecnologías para crear aplicaciones Android modernas y eficientes para empresas en México.</p>
    `,
    category: "Android",
    image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1200&auto=format&fit=crop&q=80",
    date: "8 Diciembre 2024",
    readTime: "10 min",
    author: {
      name: "Ana García",
      role: "Mobile Developer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    },
  },
};

const ArticlePage = () => {
  const { slug } = useParams();
  const article = slug ? articles[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">Artículo no encontrado</h1>
            <p className="mb-8 text-muted-foreground">
              Lo sentimos, no pudimos encontrar el artículo que buscas.
            </p>
            <Button asChild>
              <Link to="/">Volver al Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    Tech: "bg-accent/10 text-accent",
    Business: "bg-emerald-500/10 text-emerald-600",
    UX: "bg-amber-500/10 text-amber-600",
    iOS: "bg-blue-500/10 text-blue-600",
    Android: "bg-green-500/10 text-green-600",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Image */}
        <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden lg:h-[50vh]">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container relative -mt-24 lg:-mt-32">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Article Content */}
            <article className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:p-10">
                {/* Back Button */}
                <Link
                  to="/"
                  className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al Blog
                </Link>

                {/* Category */}
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    categoryColors[article.category] || "bg-primary/10 text-primary"
                  }`}
                >
                  {article.category}
                </span>

                {/* Title */}
                <h1 className="mt-4 text-2xl font-extrabold leading-tight text-card-foreground sm:text-3xl lg:text-4xl">
                  {article.title}
                </h1>

                {/* Meta */}
                <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">
                        {article.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{article.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="ml-auto flex gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="prose prose-slate mt-8 max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-card-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-card-foreground prose-ul:text-muted-foreground prose-li:marker:text-primary"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* CTA */}
                <div className="mt-12 rounded-2xl bg-hero-gradient p-8 text-center text-primary-foreground">
                  <h3 className="text-xl font-bold">¿Listo para desarrollar tu app?</h3>
                  <p className="mt-2 text-primary-foreground/80">
                    Cotiza tu proyecto de desarrollo de apps móviles con expertos en Bridge Studio.
                  </p>
                  <Button variant="cta" size="lg" className="mt-6 bg-background text-foreground hover:bg-background/90" asChild>
                    <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer">
                      Cotizar en Bridge Studio
                    </a>
                  </Button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
