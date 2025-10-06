import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Github, Star, Users, Code, Search, Plus, ExternalLink } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';

const ProjectsPage: React.FC = () => {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const mockProjects = [
    {
      id: '1',
      name: 'Student Portal API',
      description: 'RESTful API for managing student information, courses, and grades',
      repositoryUrl: 'https://github.com/example/student-portal',
      techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      difficultyLevel: 'intermediate',
      lookingFor: ['Backend Developer', 'Database Admin', 'API Tester'],
      contributors: 8,
      stars: 45,
      owner: 'Tech Students Club'
    },
    {
      id: '2',
      name: 'Campus Event Tracker',
      description: 'Mobile app to discover and track campus events in real-time',
      repositoryUrl: 'https://github.com/example/event-tracker',
      techStack: ['React Native', 'Firebase', 'TypeScript'],
      difficultyLevel: 'beginner',
      lookingFor: ['Frontend Developer', 'UI/UX Designer'],
      contributors: 5,
      stars: 23,
      owner: 'John Doe'
    },
    {
      id: '3',
      name: 'AI Study Assistant',
      description: 'ML-powered study assistant that generates quizzes and summaries',
      repositoryUrl: 'https://github.com/example/ai-assistant',
      techStack: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      difficultyLevel: 'advanced',
      lookingFor: ['ML Engineer', 'Backend Developer', 'Frontend Developer'],
      contributors: 12,
      stars: 89,
      owner: 'AI Research Lab'
    },
    {
      id: '4',
      name: 'Open Course Library',
      description: 'Community-driven platform for sharing free educational resources',
      repositoryUrl: 'https://github.com/example/course-library',
      techStack: ['Vue.js', 'Django', 'PostgreSQL'],
      difficultyLevel: 'intermediate',
      lookingFor: ['Full-stack Developer', 'Content Moderator'],
      contributors: 15,
      stars: 67,
      owner: 'Education Initiative'
    }
  ];

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      intermediate: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
      advanced: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
    };
    return colors[level] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Github className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Open Source Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Contribute to student-led open source projects and build your portfolio
            </p>
          </motion.div>

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search projects by name, tech stack, or role..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Button variant="primary" className="bg-green-600 hover:bg-green-700 whitespace-nowrap">
                <Plus className="h-5 w-5 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {difficulties.map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    difficultyFilter === level.toLowerCase()
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {project.name}
                          </h3>
                          <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-green-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${getDifficultyColor(project.difficultyLevel)}`}>
                      {project.difficultyLevel.charAt(0).toUpperCase() + project.difficultyLevel.slice(1)}
                    </span>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tech Stack:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Looking for:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.lookingFor.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs font-medium"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {project.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.contributors}
                        </span>
                      </div>
                      <Button variant="primary" size="sm" className="bg-green-600 hover:bg-green-700">
                        <Code className="h-4 w-4 mr-1" />
                        Contribute
                      </Button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      Maintained by {project.owner}
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
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8">
              <div className="text-center">
                <Github className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Start Your Own Project</h3>
                <p className="mb-4">Have an idea? Create your own open source project and invite collaborators</p>
                <Button variant="ghost" className="bg-white text-green-600 hover:bg-gray-100">
                  Create New Project
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
