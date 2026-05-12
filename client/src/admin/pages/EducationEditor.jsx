import { useState, useEffect } from 'react';
import { sectionService } from '../../services/sectionService';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2, FiMove } from 'react-icons/fi';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableEducation = ({ id, edu, index, updateEdu, removeEdu }) => {
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
            <label className="block text-xs text-zinc-400 mb-1">Institution</label>
            <input 
              type="text" 
              className="input-field text-sm py-2" 
              value={edu.institution}
              onChange={e => updateEdu(index, 'institution', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Degree / Certification</label>
            <input 
              type="text" 
              className="input-field text-sm py-2" 
              value={edu.degree}
              onChange={e => updateEdu(index, 'degree', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Dates</label>
            <input 
              type="text" 
              className="input-field text-sm py-2" 
              value={edu.dates}
              onChange={e => updateEdu(index, 'dates', e.target.value)}
              placeholder="e.g. 2015 - 2019"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Description (Optional)</label>
          <textarea 
            className="input-field text-sm min-h-[178px]" 
            value={edu.description || ''}
            onChange={e => updateEdu(index, 'description', e.target.value)}
            placeholder="Details about your studies, honors, etc."
          />
        </div>
      </div>
      
      <button 
        type="button" 
        onClick={() => removeEdu(index)}
        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-2"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

const EducationEditor = () => {
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [education, setEducation] = useState([]);

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
      const eduSection = sections.find(s => s.type === 'education');
      if (eduSection) {
        setSectionId(eduSection._id);
        const eduWithIds = (eduSection.data.education || []).map((s, i) => ({
          ...s,
          id: s.id || `edu-${i}-${Date.now()}`
        }));
        setEducation(eduWithIds);
      }
    } catch (err) {
      toast.error('Failed to load education section');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!sectionId) return;
    
    setSaving(true);
    try {
      await sectionService.updateSection(sectionId, { data: { education } });
      toast.success('Education section updated successfully');
    } catch (err) {
      toast.error('Failed to update education section');
    } finally {
      setSaving(false);
    }
  };

  const addEdu = () => {
    setEducation([
      { id: `edu-new-${Date.now()}`, institution: '', degree: '', dates: '', description: '' },
      ...education
    ]);
  };

  const updateEdu = (index, field, value) => {
    const newEdus = [...education];
    newEdus[index] = { ...newEdus[index], [field]: value };
    setEducation(newEdus);
  };

  const removeEdu = (index) => {
    const newEdus = [...education];
    newEdus.splice(index, 1);
    setEducation(newEdus);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setEducation((items) => {
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
          <h1 className="text-2xl font-bold mb-2">Education Section</h1>
          <p className="text-zinc-400">Manage your academic background.</p>
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
          <h2 className="text-xl font-semibold">Academic History</h2>
          <button 
            type="button" 
            onClick={addEdu}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FiPlus /> Add Entry
          </button>
        </div>
        
        {education.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-zinc-700 rounded-lg">
            <p className="text-zinc-500 mb-2">No education entries added yet.</p>
            <button onClick={addEdu} className="text-indigo-400 hover:text-indigo-300 text-sm">Add your first entry</button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={education} strategy={verticalListSortingStrategy}>
              <div>
                {education.map((edu, index) => (
                  <SortableEducation 
                    key={edu.id} 
                    id={edu.id} 
                    edu={edu} 
                    index={index}
                    updateEdu={updateEdu}
                    removeEdu={removeEdu}
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

export default EducationEditor;
