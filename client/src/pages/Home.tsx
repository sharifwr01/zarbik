import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code2, Zap, Globe, Sparkles } from "lucide-react";
import type { Project } from "@shared/types";

function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ReactNode> = {
    code: <Code2 className="h-8 w-8" />,
    zap: <Zap className="h-8 w-8" />,
    globe: <Globe className="h-8 w-8" />,
    sparkles: <Sparkles className="h-8 w-8" />,
  };

  return iconMap[iconName.toLowerCase()] || <Code2 className="h-8 w-8" />;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <Card className="h-full p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer">
        <div className="flex flex-col h-full">
          {/* Icon */}
          <div className="mb-4 p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg w-fit group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 text-white">
            {getIconComponent(project.icon)}
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {project.name}
          </h3>
          <p className="text-slate-400 text-sm mb-4 flex-grow">
            {project.description}
          </p>

          {/* Footer */}
          <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
            <span className="text-sm font-medium">Visit Project</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </a>
  );
}

export default function Home() {
  const { data: projects = [], isLoading } = trpc.projects.list.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Zarbik</span>
          </div>
          <div className="text-sm text-slate-400">
            Digital Projects Hub
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <p className="text-blue-400 text-sm font-medium">Welcome to Zarbik</p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            A Modern Identity Built on
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Discipline & Innovation
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Zarvik is the core hub of all my digital projects, tools, and sub-brands. Every space reflects a commitment to clarity, precision, and meaningful innovation. Simple on the surface, powerful at the core.
          </p>

          <div className="flex justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold">
              Explore Projects
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-base font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A collection of live projects showcasing modern web development, creative tools, and innovative solutions
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="h-64 bg-slate-800 border-slate-700 animate-pulse"
                />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-4">
                No projects published yet
              </p>
              <p className="text-slate-500 text-sm">
                Check back soon for exciting new projects
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700/50 mt-24">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">Zarbik</h3>
              <p className="text-slate-400 text-sm">
                A modern identity built on discipline, creativity, and forward-thinking execution.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8 text-center text-sm text-slate-500">
            <p>© 2025 Zarbik. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
