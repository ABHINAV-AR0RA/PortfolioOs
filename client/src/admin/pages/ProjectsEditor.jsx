import { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';

const ProjectsEditor = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const initialFormState = {
    title: '',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    featured: false,
    order: 0
  };
  const [formData, setFormData] = useState(initialFormState);
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData(initialFormState);
    }
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }
    
    setSaving(true);
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject._id, formData);
        toast.success('Project updated successfully');
      } else {
        await projectService.createProject(formData);
        toast.success('Project created successfully');
      }
      fetchProjects();
      handleCloseModal();
    } catch (err) {
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const addTech = (e) => {
    e.preventDefault();
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTech = (techToRemove) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(tech => tech !== techToRemove)
    });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-indigo-500" /></div>;

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Projects</h1>
          <p className="text-zinc-400">Manage your portfolio projects.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-16 border-dashed">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFolder className="text-2xl text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-zinc-400 mb-6">Create your first project to showcase your work.</p>
          <button onClick={() => handleOpenModal()} className="text-indigo-400 hover:text-indigo-300">
            Click here to add a project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project._id} className="card flex flex-col group overflow-hidden p-0">
              <div className="h-48 bg-zinc-800 relative">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500">No Image</div>
                )}
                {project.featured && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-indigo-500 text-white text-xs font-bold rounded">
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(project)} className="p-2 bg-zinc-900/80 hover:bg-zinc-900 text-white rounded-lg backdrop-blur-sm">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 truncate">{project.title}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">{tech}</span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">+{project.technologies.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl shadow-2xl relative my-8">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-white transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea 
                      className="input-field min-h-[120px]" 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub URL</label>
                      <input 
                        type="url" 
                        className="input-field" 
                        value={formData.githubUrl}
                        onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Live URL</label>
                      <input 
                        type="url" 
                        className="input-field" 
                        value={formData.liveUrl}
                        onChange={e => setFormData({...formData, liveUrl: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Image</label>
                    <ImageUploader 
                      value={formData.imageUrl}
                      onChange={(url) => setFormData({...formData, imageUrl: url})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Technologies</label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        className="input-field py-2" 
                        value={techInput}
                        onChange={e => setTechInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTech(e)}
                        placeholder="Add tech..."
                      />
                      <button 
                        type="button" 
                        onClick={addTech}
                        className="px-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies.map(tech => (
                        <span key={tech} className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded border border-indigo-500/20">
                          {tech}
                          <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-400 ml-1">
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-indigo-500 rounded bg-zinc-800 border-zinc-700"
                        checked={formData.featured}
                        onChange={e => setFormData({...formData, featured: e.target.checked})}
                      />
                      <span className="text-sm font-medium">Featured Project</span>
                    </label>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-400">Sort Order</label>
                      <input 
                        type="number" 
                        className="input-field py-1 text-sm" 
                        value={formData.order}
                        onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave />}
                  {editingProject ? 'Update' : 'Create'} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsEditor;
