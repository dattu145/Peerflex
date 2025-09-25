// src/components/resume/ResumePreview.tsx
import React from 'react';
import { ResumeData } from '../../types/resume';

interface ResumePreviewProps {
  templateId: string;
  data: ResumeData;
  withWatermark: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ templateId, data, withWatermark }) => {

  return (
    <div className="resume-preview">
      {/* Watermark overlay */}
      {withWatermark && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                #ff0000 10px,
                #ff0000 20px
              )`,
              zIndex: 10
            }}
          />
          <div className="absolute bottom-4 right-4 text-red-500 text-sm font-bold opacity-50">
            CampusPro Preview
          </div>
        </div>
      )}
      
      {/* Resume content based on template */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
        {/* Rest of resume content */}
      </div>
    </div>
  );
};

export default ResumePreview;