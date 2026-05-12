import { useState, useEffect } from 'react';
import { sectionService } from '../../services/sectionService';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2, FiMove } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableExperience = ({ id, exp, index, updateExp, removeExp }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-4 items-start p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50 mb-4">
      <div {...attributes} {...listeners} className="cursor-grab p-2 text-zinc-500 hover:text-zinc-300 mt-2">
        <FiMove />
      </div>
      
      <div className="flex-1 grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Company</label>
            <input 
              type="text" 
              className="input-field text-sm py-2" 
              value={exp.company}
              onChange={e => updateExp(index, 'company', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Role</label>
            <input 
              type="text" 
              className="input-field text-sm py-2" 
              value={exp.role}
              onChange={e => updateExp(index, 'role', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Duration</label>
            <input 
              type="text" 
              className="input-field text-sm py-2" 
              value={exp.duration}
              onChange={e => updateExp(index, 'duration', e.target.value)}
              placeholder="e.g. Jan 2020 - Present"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Description</label>
          <textarea 
            className="input-field text-sm min-h-[178px]" 
            value={exp.description}
            onChange={e => updateExp(index, 'description', e.target.value)}
            placeholder="Describe your responsibilities and achievements..."
          />
        </div>
      </div>
      
      <button 
        type="button" 
        onClick={() => removeExp(index)}
        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-2"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

const ExperienceEditor = () => {
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [experiences, setExperiences] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sections = await sectionService.getSections();
      const expSection = sections.find(s => s.type === 'experience');
      if (expSection) {
        setSectionId(expSection._id);
        const expsWithIds = (expSection.data.experiences || []).map((s, i) => ({
          ...s,
          id: s.id || `exp-${i}-${Date.now()}`
        }));
        setExperiences(expsWithIds);
      }
    } catch (err) {
      toast.error('Failed to load experience section');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!sectionId) return;
    
    setSaving(true);
    try {
      await sectionService.updateSection(sectionId, { data: { experiences } });
      toast.success('Experience section updated successfully');
    } catch (err) {
      toast.error('Failed to update experience section');
    } finally {
      setSaving(false);
    }
  };

  const addExp = () => {
    setExperiences([
      { id: `exp-new-${Date.now()}`, company: '', role: '', duration: '', description: '' },
      ...experiences
    ]);
  };

  const updateExp = (index, field, value) => {
    const newExps = [...experiences];
    newExps[index] = { ...newExps[index], [field]: value };
    setExperiences(newExps);
  };

  const removeExp = (index) => {
    const newExps = [...experiences];
    newExps.splice(index, 1);
    setExperiences(newExps);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setExperiences((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-indigo-500" /></div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Experience Section</h1>
          <p className="text-zinc-400">Manage your work history.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave />}
          Save Changes
        </button>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Work History</h2>
          <button 
            type="button" 
            onClick={addExp}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FiPlus /> Add Role
          </button>
        </div>
        
        {experiences.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-zinc-700 rounded-lg">
            <p className="text-zinc-500 mb-2">No experience entries added yet.</p>
            <button onClick={addExp} className="text-indigo-400 hover:text-indigo-300 text-sm">Add your first role</button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={experiences} strategy={verticalListSortingStrategy}>
              <div>
                {experiences.map((exp, index) => (
                  <SortableExperience 
                    key={exp.id} 
                    id={exp.id} 
                    exp={exp} 
                    index={index}
                    updateExp={updateExp}
                    removeExp={removeExp}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default ExperienceEditor;
