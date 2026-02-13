import React from 'react';
import { ResumeData, Experience, Education, Skill, Project } from '../types';

interface TemplateProps {
  data: ResumeData;
}

// --- Helper Components ---
const SectionTitle: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({ children, color, className = '' }) => (
  <h3 className={`text-lg font-bold uppercase tracking-wider mb-3 border-b-2 pb-1 ${className}`} style={{ borderColor: color }}>
    {children}
  </h3>
);

const DateRange: React.FC<{ start: string; end: string; isCurrent?: boolean }> = ({ start, end, isCurrent }) => {
  const formatDate = (d: string) => {
    if (!d) return '';
    const date = new Date(d + '-01'); // Append day to make it parseable
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  return <span className="text-sm text-gray-600 italic">{formatDate(start)} - {isCurrent ? 'Present' : formatDate(end)}</span>;
};

// --- Templates ---

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, meta } = data;
  const primaryColor = meta.themeColor || '#2563eb';

  return (
    <div className="w-full h-full bg-white p-8 font-sans text-gray-800" id="resume-content">
      {/* Header */}
      <header className="border-b-4 pb-6 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-gray-900">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.address && <span>• {personalInfo.address}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="col-span-8 space-y-6">
          {personalInfo.summary && (
            <section>
              <SectionTitle color={primaryColor}>Profile</SectionTitle>
              <p className="text-sm leading-relaxed text-gray-700">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <SectionTitle color={primaryColor}>Experience</SectionTitle>
              <div className="space-y-5">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-gray-900">{exp.jobTitle}</h4>
                      <DateRange start={exp.startDate} end={exp.endDate} isCurrent={exp.isCurrent} />
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">{exp.company}</div>
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionTitle color={primaryColor}>Projects</SectionTitle>
              <div className="space-y-4">
                {projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900">{proj.title}</h4>
                      {proj.link && <a href={proj.link} className="text-xs text-blue-600 hover:underline">{proj.link}</a>}
                    </div>
                    <p className="text-xs text-gray-500 mb-1 font-mono">{proj.technologies}</p>
                    <p className="text-sm text-gray-600">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="col-span-4 space-y-6">
           {education.length > 0 && (
            <section>
              <SectionTitle color={primaryColor}>Education</SectionTitle>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                    <div className="text-sm text-gray-700">{edu.degree}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <DateRange start={edu.startDate} end={edu.endDate} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionTitle color={primaryColor}>Skills</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;
  
  return (
    <div className="w-full h-full bg-white p-10 font-serif text-gray-900" id="resume-content">
      <div className="text-center border-b-2 border-gray-900 pb-6 mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">{personalInfo.fullName}</h1>
        <p className="text-sm text-gray-600">
          {personalInfo.address} | {personalInfo.phone} | {personalInfo.email}
        </p>
      </div>

      {personalInfo.summary && (
        <div className="mb-6">
           <h3 className="text-center font-bold uppercase text-sm tracking-widest mb-3">Professional Summary</h3>
           <p className="text-sm leading-relaxed text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-center font-bold uppercase text-sm tracking-widest mb-4 bg-gray-100 py-1">Experience</h3>
          <div className="space-y-6">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.company}, {exp.location}</span>
                  <DateRange start={exp.startDate} end={exp.endDate} isCurrent={exp.isCurrent} />
                </div>
                <div className="text-sm italic mb-2">{exp.jobTitle}</div>
                <p className="text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-6">
           <h3 className="text-center font-bold uppercase text-sm tracking-widest mb-4 bg-gray-100 py-1">Education</h3>
           {education.map(edu => (
             <div key={edu.id} className="mb-2">
               <div className="flex justify-between font-bold text-sm">
                 <span>{edu.institution}</span>
                 <DateRange start={edu.startDate} end={edu.endDate} />
               </div>
               <div className="text-sm">{edu.degree}</div>
             </div>
           ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
           <h3 className="text-center font-bold uppercase text-sm tracking-widest mb-4 bg-gray-100 py-1">Skills</h3>
           <p className="text-sm text-center">
             {skills.map(s => s.name).join(' • ')}
           </p>
        </div>
      )}
    </div>
  );
};

const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
   const { personalInfo, experience, education, skills, projects, meta } = data;
   const accent = meta.themeColor || '#8b5cf6'; // Violet default

   return (
     <div className="w-full h-full bg-white flex font-sans" id="resume-content">
        {/* Left Dark Sidebar */}
        <div className="w-1/3 bg-slate-900 text-white p-6 flex flex-col gap-6">
           <div className="mb-4">
             <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold mb-4 mx-auto">
                {personalInfo.fullName.charAt(0)}
             </div>
             <h2 className="text-xl font-bold text-center tracking-wide">{personalInfo.fullName}</h2>
             <p className="text-center text-slate-400 text-xs mt-1">{experience[0]?.jobTitle}</p>
           </div>

           <div className="space-y-2 text-xs text-slate-300">
              <p className="border-b border-slate-700 pb-2 mb-2 font-bold uppercase tracking-wider text-slate-400">Contact</p>
              <div className="break-words">{personalInfo.email}</div>
              <div>{personalInfo.phone}</div>
              <div>{personalInfo.address}</div>
              {personalInfo.website && <div className="text-blue-400">{personalInfo.website}</div>}
           </div>

           {skills.length > 0 && (
             <div className="text-xs">
                <p className="border-b border-slate-700 pb-2 mb-4 font-bold uppercase tracking-wider text-slate-400">Skills</p>
                <div className="space-y-3">
                  {skills.map(skill => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-1">
                        <span>{skill.name}</span>
                        {/* <span className="opacity-50">{skill.level}</span> */}
                      </div>
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white/80" 
                          style={{ width: skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '75%' : skill.level === 'Intermediate' ? '50%' : '25%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {education.length > 0 && (
             <div className="text-xs">
                <p className="border-b border-slate-700 pb-2 mb-4 font-bold uppercase tracking-wider text-slate-400">Education</p>
                {education.map(edu => (
                  <div key={edu.id} className="mb-3">
                    <div className="font-bold text-white">{edu.degree}</div>
                    <div className="text-slate-400">{edu.institution}</div>
                    <div className="text-slate-500 italic"><DateRange start={edu.startDate} end={edu.endDate} /></div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-8 bg-white">
           {personalInfo.summary && (
             <div className="mb-8">
               <h3 className="text-xl font-display font-bold uppercase mb-3 text-slate-800" style={{ color: accent }}>Profile</h3>
               <p className="text-sm text-slate-600 leading-relaxed">{personalInfo.summary}</p>
             </div>
           )}

           {experience.length > 0 && (
             <div className="mb-8">
               <h3 className="text-xl font-display font-bold uppercase mb-5 text-slate-800" style={{ color: accent }}>Work Experience</h3>
               <div className="relative border-l-2 border-slate-100 ml-2 space-y-8 pl-6">
                 {experience.map(exp => (
                   <div key={exp.id} className="relative">
                     <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: accent }}></div>
                     <h4 className="font-bold text-slate-800">{exp.jobTitle}</h4>
                     <div className="text-sm font-semibold text-slate-500 mb-2">{exp.company} <span className="mx-1">|</span> <DateRange start={exp.startDate} end={exp.endDate} isCurrent={exp.isCurrent} /></div>
                     <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {projects.length > 0 && (
             <div>
               <h3 className="text-xl font-display font-bold uppercase mb-5 text-slate-800" style={{ color: accent }}>Projects</h3>
               <div className="grid grid-cols-1 gap-4">
                 {projects.map(proj => (
                   <div key={proj.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                     <h4 className="font-bold text-slate-800 text-sm mb-1">{proj.title}</h4>
                     <p className="text-xs text-slate-500 mb-2 font-mono">{proj.technologies}</p>
                     <p className="text-xs text-slate-600">{proj.description}</p>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>
     </div>
   );
};

export const ResumePreview: React.FC<TemplateProps> = ({ data }) => {
  const renderTemplate = () => {
    switch (data.meta.templateId) {
      case 'modern': return <ModernTemplate data={data} />;
      case 'classic': return <ClassicTemplate data={data} />;
      case 'creative': return <CreativeTemplate data={data} />;
      default: return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="w-full h-full bg-slate-100 overflow-y-auto p-8 flex justify-center items-start print:p-0 print:overflow-visible">
      <div id="resume-preview-container" className="bg-white shadow-2xl w-[210mm] min-h-[297mm] print:shadow-none print:w-full print:h-full">
        {renderTemplate()}
      </div>
    </div>
  );
};
