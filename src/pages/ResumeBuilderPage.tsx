// src/pages/ResumeBuilderPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Save, Download, Eye, Wand2, Plus, Trash2, 
  Upload, Link2, Calendar, MapPin 
} from 'lucide-react';
import { RESUME_TEMPLATES } from '../data/resumeTemplates';
import { ResumeData, Education, Experience, Project, Skill, Certification, Language } from '../types/resume';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ResumePreview from '../components/resume/ResumePreview';
import AISuggestions from '../components/resume/AISuggestions';

const ResumeBuilderPage: React.FC = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      portfolioUrl: '',
      linkedinUrl: '',
      githubUrl: ''
    },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: []
  });
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedResumeTemplate');
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    } else {
      navigate('/resume-templates');
    }

    // Load saved data if exists
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
  }, [navigate]);

  const updateResumeData = (section: string, data: any) => {
    const updatedData = { ...resumeData, [section]: data };
    setResumeData(updatedData);
    localStorage.setItem('resumeData', JSON.stringify(updatedData));
  };

  const addItem = (section: string, defaultItem: any) => {
    const newItem = { ...defaultItem, id: Date.now().toString() };
    const currentItems = resumeData[section as keyof ResumeData] as any[];
    updateResumeData(section, [...currentItems, newItem]);
  };

  const removeItem = (section: string, id: string) => {
    const currentItems = resumeData[section as keyof ResumeData] as any[];
    updateResumeData(section, currentItems.filter(item => item.id !== id));
  };

  const updateItem = (section: string, id: string, updates: any) => {
    const currentItems = resumeData[section as keyof ResumeData] as any[];
    const updatedItems = currentItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateResumeData(section, updatedItems);
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: MapPin },
    { id: 'summary', name: 'Summary', icon: Wand2 },
    { id: 'education', name: 'Education', icon: Calendar },
    { id: 'experience', name: 'Experience', icon: Calendar },
    { id: 'projects', name: 'Projects', icon: Link2 },
    { id: 'skills', name: 'Skills', icon: Wand2 },
    { id: 'certifications', name: 'Certifications', icon: Save },
    { id: 'languages', name: 'Languages', icon: Save }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Build Your Resume
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Fill in your details and let AI help you create the perfect resume
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              leftIcon={<Eye className="h-4 w-4" />}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              variant="primary"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Save & Continue
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {section.name}
                    </button>
                  );
                })}
              </nav>
              
              {/* AI Suggestions Panel */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <AISuggestions 
                  resumeData={resumeData} 
                  onApplySuggestion={(suggestion) => {
                    // Apply AI suggestions to relevant sections
                    console.log('Applying suggestion:', suggestion);
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              {activeSection === 'personal' && (
                <PersonalInfoSection
                  data={resumeData.personalInfo}
                  onChange={(data) => updateResumeData('personalInfo', data)}
                />
              )}
              
              {activeSection === 'summary' && (
                <SummarySection
                  data={resumeData.summary}
                  onChange={(data) => updateResumeData('summary', data)}
                />
              )}
              
              {activeSection === 'education' && (
                <ListSection
                  title="Education"
                  items={resumeData.education}
                  onAdd={() => addItem('education', {
                    institution: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                    grade: ''
                  })}
                  onRemove={(id) => removeItem('education', id)}
                  onUpdate={(id, updates) => updateItem('education', id, updates)}
                  renderItem={(item: Education) => (
                    <EducationForm item={item} />
                  )}
                />
              )}
              
              {/* Similar sections for Experience, Projects, Skills, etc. */}
              
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <ResumePreview 
                  templateId={selectedTemplate} 
                  data={resumeData} 
                  withWatermark={true}
                />
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Preview Only:</strong> Watermark will be removed after payment
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Form Components for each section
const PersonalInfoSection: React.FC<{ data: any, onChange: (data: any) => void }> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="john@example.com"
          />
        </div>
        
        {/* More fields... */}
      </div>
    </div>
  );
};

const SummarySection: React.FC<{ data: string, onChange: (data: string) => void }> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Summary</h3>
      <textarea
        value={data}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        placeholder="Describe your professional background, skills, and career objectives..."
      />
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Let AI help you write a compelling summary
      </p>
    </div>
  );
};

const ListSection: React.FC<{
  title: string;
  items: any[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  renderItem: (item: any) => React.ReactNode;
}> = ({ title, items, onAdd, onRemove, onUpdate, renderItem }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Button variant="outline" size="sm" onClick={onAdd} leftIcon={<Plus className="h-4 w-4" />}>
          Add {title}
        </Button>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {title} #{index + 1}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                leftIcon={<Trash2 className="h-4 w-4" />}
              >
                Remove
              </Button>
            </div>
            {renderItem(item)}
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No {title.toLowerCase()} added yet
          </div>
        )}
      </div>
    </div>
  );
};

const EducationForm: React.FC<{ item: Education }> = ({ item }) => {
  // Education form fields implementation
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Education form fields */}
    </div>
  );
};

export default ResumeBuilderPage;