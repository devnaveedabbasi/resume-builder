import React, { useState } from 'react';
import { ResumeData, INITIAL_DATA } from './types';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { Button } from './components/ui/Common';
import { FileDown, Palette, LayoutTemplate, Printer } from 'lucide-react';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', color: '#2563eb' },
  { id: 'classic', name: 'Classic', color: '#111827' },
  { id: 'creative', name: 'Creative', color: '#8b5cf6' },
];

export default function App() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor'); // For mobile

  const handlePrint = () => {
    window.print();
  };

  const updateTemplate = (id: 'modern' | 'classic' | 'creative') => {
    setData(prev => ({ ...prev, meta: { ...prev.meta, templateId: id, themeColor: TEMPLATES.find(t => t.id === id)?.color || prev.meta.themeColor } }));
  };

  const updateColor = (color: string) => {
    setData(prev => ({ ...prev, meta: { ...prev.meta, themeColor: color } }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navigation */}
      <nav className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 z-50 print:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md font-bold text-lg">RA</div>
          <h1 className="font-bold text-xl tracking-tight hidden md:block">ResumeAI Builder</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-4 bg-slate-800 p-1 rounded-lg">
             {TEMPLATES.map(t => (
               <button 
                 key={t.id}
                 onClick={() => updateTemplate(t.id as any)}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${data.meta.templateId === t.id ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
               >
                 {t.name}
               </button>
             ))}
          </div>
          
          <div className="flex items-center gap-2">
             <label className="text-xs text-slate-400 hidden md:block">Accent:</label>
             <input 
               type="color" 
               value={data.meta.themeColor} 
               onChange={(e) => updateColor(e.target.value)}
               className="h-8 w-8 rounded cursor-pointer border-none bg-transparent"
             />
          </div>

          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print / PDF
          </Button>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor Side */}
        <div className={`w-full md:w-1/2 lg:w-5/12 border-r bg-white h-full flex flex-col ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'} print:hidden`}>
          <ResumeForm data={data} updateData={setData} />
        </div>

        {/* Preview Side */}
        <div className={`w-full md:w-1/2 lg:w-7/12 h-full bg-slate-100 ${activeTab === 'editor' ? 'hidden md:block' : 'block'} print:w-full print:block`}>
          <ResumePreview data={data} />
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex h-14 border-t bg-white text-xs font-medium fixed bottom-0 w-full z-40 print:hidden">
         <button 
           className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeTab === 'editor' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
           onClick={() => setActiveTab('editor')}
         >
           <LayoutTemplate className="w-4 h-4" />
           Editor
         </button>
         <button 
           className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeTab === 'preview' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
           onClick={() => setActiveTab('preview')}
         >
           <FileDown className="w-4 h-4" />
           Preview
         </button>
      </div>
    </div>
  );
}
