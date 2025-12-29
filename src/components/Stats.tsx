import { BookOpen, Code, TrendingUp, Users } from "lucide-react";

const Stats = () => {
    const stats = [
        {
            icon: BookOpen,
            value: "100+",
            label: "Artículos Técnicos",
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            icon: Code,
            value: "15+",
            label: "Tecnologías Cubiertas",
            color: "text-accent",
            bgColor: "bg-accent/10",
        },
        {
            icon: TrendingUp,
            value: "50K+",
            label: "Lectores Mensuales",
            color: "text-secondary",
            bgColor: "bg-secondary/10",
        },
        {
            icon: Users,
            value: "10+",
            label: "Años de Experiencia",
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
    ];

    return (
        <section className="border-y border-border bg-muted/30 py-12 lg:py-16">
            <div className="container">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="animate-fade-up group text-center opacity-0"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${stat.bgColor} transition-transform group-hover:scale-110`}>
                                    <Icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                                <div className={`mb-2 text-4xl font-black ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Stats;
