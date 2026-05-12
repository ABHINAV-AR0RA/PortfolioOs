import { useState, useEffect } from 'react';
import { sectionService } from '../../services/sectionService';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2, FiMove } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableSkill = ({ id, skill, index, updateSkill, removeSkill }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-4 items-center p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/50 mb-2">
      <div {...attributes} {...listeners} className="cursor-grab p-2 text-zinc-500 hover:text-zinc-300">
        <FiMove />
      </div>
      
      <div className="flex-1 grid grid-cols-12 gap-3">
        <div className="col-span-4">
          <input 
            type="text" 
            className="input-field text-sm py-2" 
            value={skill.name}
            onChange={e => updateSkill(index, 'name', e.target.value)}
            placeholder="Skill Name"
          />
        </div>
        <div className="col-span-4">
          <input 
            type="text" 
            className="input-field text-sm py-2" 
            value={skill.category}
            onChange={e => updateSkill(index, 'category', e.target.value)}
            placeholder="Category"
          />
        </div>
        <div className="col-span-4 flex items-center gap-2">
          <input 
            type="range" 
            min="0" max="100" 
            className="flex-1 accent-indigo-500" 
            value={skill.proficiency}
            onChange={e => updateSkill(index, 'proficiency', parseInt(e.target.value))}
          />
          <span className="text-sm font-mono w-8 text-right">{skill.proficiency}%</span>
        </div>
      </div>
      
      <button 
        type="button" 
        onClick={() => removeSkill(index)}
        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

const SkillsEditor = () => {
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState([]);

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
      const skillsSection = sections.find(s => s.type === 'skills');
      if (skillsSection) {
        setSectionId(skillsSection._id);
        // Add unique IDs for dnd-kit if missing
        const skillsWithIds = (skillsSection.data.skills || []).map((s, i) => ({
          ...s,
          id: s.id || `skill-${i}-${Date.now()}`
        }));
        setSkills(skillsWithIds);
      }
    } catch (err) {
      toast.error('Failed to load skills section');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!sectionId) return;
    
    setSaving(true);
    try {
      await sectionService.updateSection(sectionId, { data: { skills } });
      toast.success('Skills section updated successfully');
    } catch (err) {
      toast.error('Failed to update skills section');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    setSkills([
      ...skills, 
      { id: `skill-new-${Date.now()}`, name: 'New Skill', category: 'Frontend', proficiency: 50 }
    ]);
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
  };

  const removeSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSkills((items) => {
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
          <h1 className="text-2xl font-bold mb-2">Skills Section</h1>
          <p className="text-zinc-400">Manage your technical skills and proficiency levels.</p>
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
          <h2 className="text-xl font-semibold">Skills List</h2>
          <button 
            type="button" 
            onClick={addSkill}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FiPlus /> Add Skill
          </button>
        </div>
        
        {skills.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-zinc-700 rounded-lg">
            <p className="text-zinc-500 mb-2">No skills added yet.</p>
            <button onClick={addSkill} className="text-indigo-400 hover:text-indigo-300 text-sm">Add your first skill</button>
          </div>
        ) : (
          <div className="hidden md:grid grid-cols-12 gap-3 mb-2 px-11 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <div className="col-span-4">Name</div>
            <div className="col-span-4">Category</div>
            <div className="col-span-4">Proficiency</div>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={skills} strategy={verticalListSortingStrategy}>
            <div>
              {skills.map((skill, index) => (
                <SortableSkill 
                  key={skill.id} 
                  id={skill.id} 
                  skill={skill} 
                  index={index}
                  updateSkill={updateSkill}
                  removeSkill={removeSkill}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default SkillsEditor;
