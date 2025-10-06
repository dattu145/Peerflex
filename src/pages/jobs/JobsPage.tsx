import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter, TrendingUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';

const JobsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');

  const jobTypes = ['All', 'Internship', 'Full-time', 'Part-time', 'Contract'];

  const mockJobs = [
    {
      id: '1',
      title: 'Software Engineering Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      jobType: 'internship',
      salary: '$7k - $9k/month',
      skills: ['React', 'TypeScript', 'Node.js'],
      postedTime: '2 days ago',
      applicants: 234
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Meta',
      location: 'Remote',
      jobType: 'full-time',
      salary: '$120k - $180k/year',
      skills: ['React', 'JavaScript', 'CSS'],
      postedTime: '1 week ago',
      applicants: 567
    },
    {
      id: '3',
      title: 'Data Science Intern',
      company: 'Microsoft',
      location: 'Redmond, WA',
      jobType: 'internship',
      salary: '$6k - $8k/month',
      skills: ['Python', 'Machine Learning', 'SQL'],
      postedTime: '3 days ago',
      applicants: 189
    },
    {
      id: '4',
      title: 'UX Design Intern',
      company: 'Apple',
      location: 'Cupertino, CA',
      jobType: 'internship',
      salary: '$7k - $10k/month',
      skills: ['Figma', 'UI/UX', 'Prototyping'],
      postedTime: '5 days ago',
      applicants: 412
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Briefcase className="h-12 w-12 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Job Opportunities
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover internships and jobs with auto-apply integration
            </p>
          </motion.div>

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <Button variant="primary" className="whitespace-nowrap bg-orange-600 hover:bg-orange-700">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setJobTypeFilter(type.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    jobTypeFilter === type.toLowerCase()
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-orange-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {job.title}
                          </h3>
                        </div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {job.company}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.jobType === 'internship'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}>
                        {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{job.postedTime}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <TrendingUp className="h-4 w-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                        <Button variant="primary" size="sm" className="bg-orange-600 hover:bg-orange-700">
                          Quick Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-8">
              <h3 className="text-2xl font-bold mb-2">Auto-Apply Integration</h3>
              <p className="mb-4">Connect with n8n to automatically apply to matching jobs</p>
              <Button variant="ghost" className="bg-white text-orange-600 hover:bg-gray-100">
                Setup Auto-Apply
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default JobsPage;
