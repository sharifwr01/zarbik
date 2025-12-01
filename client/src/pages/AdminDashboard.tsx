import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, LogOut } from "lucide-react";
import type { Project } from "@shared/types";

interface ProjectForm {
  id?: string;
  name: string;
  description: string;
  icon: string;
  link: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProjectForm>({
    name: "",
    description: "",
    icon: "",
    link: "",
  });

  const { data: projects = [], refetch } = trpc.projects.list.useQuery();

  const addMutation = trpc.admin.addProject.useMutation({
    onSuccess: () => {
      toast.success("Project added successfully");
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add project");
    },
  });

  const updateMutation = trpc.admin.updateProject.useMutation({
    onSuccess: () => {
      toast.success("Project updated successfully");
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update project");
    },
  });

  const deleteMutation = trpc.admin.deleteProject.useMutation({
    onSuccess: () => {
      toast.success("Project deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete project");
    },
  });

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      setLocation("/");
    },
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", icon: "", link: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      id: project.id,
      name: project.name,
      description: project.description,
      icon: project.icon,
      link: project.link,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.icon || !formData.link) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
      } else {
        await addMutation.mutateAsync(formData);
      }
    } catch (error) {
      // Error already handled by mutation callbacks
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Zarbik Admin</h1>
            <p className="text-slate-400 mt-1">Manage your projects</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8 p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="My Awesome Project"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Link
                  </label>
                  <Input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of your project"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Icon (SVG or Icon Name)
                </label>
                <Input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="e.g., 'code', 'rocket', 'star' or SVG content"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {addMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Project"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Add Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-6 bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{project.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-slate-700 rounded-lg">
                <p className="text-xs text-slate-400">Icon:</p>
                <p className="text-sm text-slate-300 truncate">{project.icon}</p>
              </div>

              <div className="mb-4">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm truncate block"
                >
                  {project.link}
                </a>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(project)}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(project.id)}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {projects.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No projects yet</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
