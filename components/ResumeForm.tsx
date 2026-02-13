import React, { useState } from 'react';
import { ResumeData, Experience, Education, Skill, Project } from '../types';
import { generateResumeSummary } from '../services/geminiService';
import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle } from './ui/Common';
import { Plus, Trash2, Wand2, ChevronRight, ChevronLeft, Save } from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  updateData: (data: ResumeData) => void;
}

const STEPS = ['Personal', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'];

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, updateData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleChange = (section: keyof ResumeData, field: string, value: any) => {
    updateData({
      ...data,
      [section]: {
        ...data[section as keyof ResumeData] as any,
        [field]: value
      }
    });
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingAI(true);
    try {
      const summary = await generateResumeSummary(data);
      handleChange('personalInfo', 'summary', summary);
    } catch (error) {
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // --- Dynamic Array Helpers ---
  const addItem = <T extends { id: string }>(section: keyof ResumeData, item: T) => {
    updateData({
      ...data,
      [section]: [...(data[section] as any[]), item]
    });
  };

  const removeItem = (section: keyof ResumeData, id: string) => {
    updateData({
      ...data,
      [section]: (data[section] as any[]).filter((i) => i.id !== id)
    });
  };

  const updateItem = (section: keyof ResumeData, id: string, field: string, value: any) => {
    updateData({
      ...data,
      [section]: (data[section] as any[]).map((i) => i.id === id ? { ...i, [field]: value } : i)
    });
  };

  // --- Render Steps ---

  const renderPersonal = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" value={data.personalInfo.fullName} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} placeholder="John Doe" />
        <Input label="Email" type="email" value={data.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} placeholder="john@example.com" />
        <Input label="Phone" value={data.personalInfo.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} placeholder="+1 234 567 890" />
        <Input label="Location" value={data.personalInfo.address} onChange={(e) => handleChange('personalInfo', 'address', e.target.value)} placeholder="New York, NY" />
        <Input label="Website" value={data.personalInfo.website} onChange={(e) => handleChange('personalInfo', 'website', e.target.value)} placeholder="https://johndoe.com" />
        <Input label="LinkedIn" value={data.personalInfo.linkedin} onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
        <Input label="GitHub" value={data.personalInfo.github} onChange={(e) => handleChange('personalInfo', 'github', e.target.value)} placeholder="github.com/johndoe" />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center mb-2">
         <p className="text-sm text-slate-500">Write a short professional summary or let AI generate one for you.</p>
         <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateSummary}
            isLoading={isGeneratingAI}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
         >
           <Wand2 className="w-4 h-4 mr-2" />
           Generate with Gemini
         </Button>
      </div>
      <Textarea 
        rows={6} 
        value={data.personalInfo.summary} 
        onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)} 
        placeholder="Experienced Software Engineer with a focus on..." 
      />
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {data.experience.map((exp) => (
        <Card key={exp.id} className="relative border-l-4 border-l-slate-800">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            onClick={() => removeItem('experience', exp.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <CardContent className="pt-6 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Job Title" value={exp.jobTitle} onChange={(e) => updateItem('experience', exp.id, 'jobTitle', e.target.value)} />
              <Input label="Company" value={exp.company} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
              <Input label="Start Date" type="month" value={exp.startDate} onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} />
              <div className="flex flex-col">
                 <Input 
                   label="End Date" 
                   type="month" 
                   value={exp.endDate} 
                   onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} 
                   disabled={exp.isCurrent}
                 />
                 <label className="flex items-center mt-2 text-sm text-slate-600">
                    <input 
                      type="checkbox" 
                      checked={exp.isCurrent} 
                      onChange={(e) => updateItem('experience', exp.id, 'isCurrent', e.target.checked)}
                      className="mr-2 rounded border-slate-300"
                    />
                    Currently Working Here
                 </label>
              </div>
            </div>
            <Textarea label="Responsibilities" value={exp.description} onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)} placeholder="• Led a team of..." />
          </CardContent>
        </Card>
      ))}
      <Button 
        variant="outline" 
        className="w-full border-dashed border-2 py-6 text-slate-500 hover:border-slate-400 hover:text-slate-700"
        onClick={() => addItem('experience', {
          id: Date.now().toString(),
          jobTitle: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          description: ''
        })}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Position
      </Button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
       {data.education.map((edu) => (
        <Card key={edu.id} className="relative border-l-4 border-l-blue-600">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            onClick={() => removeItem('education', edu.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <CardContent className="pt-6 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Degree / Major" value={edu.degree} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
              <Input label="Institution" value={edu.institution} onChange={(e) => updateItem('education', edu.id, 'institution', e.target.value)} />
              <Input label="Start Date" type="month" value={edu.startDate} onChange={(e) => updateItem('education', edu.id, 'startDate', e.target.value)} />
              <Input label="End Date" type="month" value={edu.endDate} onChange={(e) => updateItem('education', edu.id, 'endDate', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button 
        variant="outline" 
        className="w-full border-dashed border-2 py-6 text-slate-500 hover:border-slate-400 hover:text-slate-700"
        onClick={() => addItem('education', {
          id: Date.now().toString(),
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: ''
        })}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Education
      </Button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-2 p-2 bg-white border rounded-md shadow-sm">
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
              value={skill.name}
              onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)}
              placeholder="Skill Name (e.g. React)"
            />
             <select 
               className="text-xs border-none bg-slate-50 rounded px-2 py-1 text-slate-600"
               value={skill.level}
               onChange={(e) => updateItem('skills', skill.id, 'level', e.target.value)}
             >
               <option>Beginner</option>
               <option>Intermediate</option>
               <option>Advanced</option>
               <option>Expert</option>
             </select>
            <button onClick={() => removeItem('skills', skill.id)} className="text-slate-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => addItem('skills', { id: Date.now().toString(), name: '', level: 'Intermediate' })}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Skill
      </Button>
    </div>
  );

  const renderProjects = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {data.projects.map((proj) => (
        <Card key={proj.id} className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
            onClick={() => removeItem('projects', proj.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <CardContent className="pt-6 grid gap-4">
            <Input label="Project Title" value={proj.title} onChange={(e) => updateItem('projects', proj.id, 'title', e.target.value)} />
            <Input label="Tech Stack" value={proj.technologies} onChange={(e) => updateItem('projects', proj.id, 'technologies', e.target.value)} placeholder="React, Node, MongoDB" />
            <Input label="Link" value={proj.link} onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)} />
            <Textarea label="Description" value={proj.description} onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)} />
          </CardContent>
        </Card>
      ))}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => addItem('projects', { id: Date.now().toString(), title: '', description: '', technologies: '' })}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Project
      </Button>
     </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Progress Steps */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <h2 className="font-semibold text-lg">{STEPS[currentStep]}</h2>
        <div className="flex gap-1">
          {STEPS.map((step, idx) => (
             <div 
               key={step} 
               className={`h-2 w-2 rounded-full transition-all ${idx === currentStep ? 'bg-slate-900 w-4' : idx < currentStep ? 'bg-slate-900' : 'bg-slate-200'}`}
             />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {currentStep === 0 && renderPersonal()}
        {currentStep === 1 && renderSummary()}
        {currentStep === 2 && renderExperience()}
        {currentStep === 3 && renderEducation()}
        {currentStep === 4 && renderSkills()}
        {currentStep === 5 && renderProjects()}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-white border-t flex justify-between items-center">
        <Button 
           variant="ghost" 
           onClick={handlePrev} 
           disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={handleNext} disabled={currentStep === STEPS.length - 1}>
           Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
