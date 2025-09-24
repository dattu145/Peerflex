// src/pages/AboutPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    Code,
    Database,
    Smartphone,
    Cloud,
    Shield,
    Rocket,
    Heart,
    Users
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';

const AboutPage: React.FC = () => {
    const { language } = useAppStore();

    const skills = [
        {
            icon: Code,
            title: 'Frontend Development',
            description: 'React, Next.js, TypeScript, Tailwind CSS, and modern JavaScript frameworks',
            technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux']
        },
        {
            icon: Database,
            title: 'Backend Development',
            description: 'Node.js, Express, Python, Django, and database management',
            technologies: ['Node.js', 'Express', 'Python', 'Django', 'MongoDB', 'PostgreSQL']
        },
        {
            icon: Smartphone,
            title: 'Mobile Development',
            description: 'Cross-platform mobile applications with React Native',
            technologies: ['React Native', 'Expo', 'iOS', 'Android']
        },
        {
            icon: Cloud,
            title: 'DevOps & Cloud',
            description: 'Deployment, CI/CD, and cloud infrastructure management',
            technologies: ['AWS', 'Docker', 'GitHub Actions', 'Vercel', 'Netlify']
        }
    ];

    const projectsStats = [
        { value: '50+', label: 'Projects Completed' },
        { value: '15+', label: 'Happy Clients' },
        { value: '3+', label: 'Years Experience' },
        { value: '100%', label: 'Client Satisfaction' }
    ];

    const values = [
        {
            icon: Shield,
            title: 'Quality & Reliability',
            description: 'Delivering robust, tested code that stands the test of time'
        },
        {
            icon: Rocket,
            title: 'Innovation',
            description: 'Staying updated with the latest technologies and best practices'
        },
        {
            icon: Users,
            title: 'Client Collaboration',
            description: 'Working closely with clients to understand their vision and needs'
        },
        {
            icon: Heart,
            title: 'Passion Driven',
            description: 'Coding with enthusiasm and attention to detail in every project'
        }
    ];

    const processSteps = [
        {
            step: '01',
            title: 'Discovery & Planning',
            description: 'Understanding your requirements and planning the solution architecture'
        },
        {
            step: '02',
            title: 'Design & Prototyping',
            description: 'Creating wireframes and prototypes for your approval'
        },
        {
            step: '03',
            title: 'Development',
            description: 'Agile development with regular updates and feedback cycles'
        },
        {
            step: '04',
            title: 'Testing & Deployment',
            description: 'Rigorous testing and smooth deployment to production'
        },
        {
            step: '05',
            title: 'Maintenance & Support',
            description: 'Ongoing support and updates to keep your project thriving'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />

            <main className="pt-24 pb-16">
                {/* Hero Section with Profile Image */}
                <section className="relative py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center lg:text-left lg:w-2/3"
                            >
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                    About Dattu
                                </h1>
                                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                                    Full-Stack Developer crafting digital solutions that make a difference
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                                    {/* Replace with your actual image path */}
                                    {/* <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                                        <span className="text-white text-4xl font-bold">D</span>
                                    </div> */}
                                    {/* Uncomment and use this if you have an actual image */}
                                    <img
                                        src="../public/myimg.jpg"
                                        alt="Dattu - Full Stack Developer"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    Available for projects
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Introduction Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    Crafting Digital Excellence
                                </h2>
                                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                    <p>
                                        Hello! I'm Dattu, a passionate full-stack developer with expertise in creating
                                        innovative web and mobile solutions. With a strong foundation in both frontend
                                        and backend technologies, I bring ideas to life through clean, efficient code
                                        and user-centered design.
                                    </p>
                                    <p>
                                        My journey in software development began 3+ years ago, and since then,
                                        I've had the privilege of working on diverse projects ranging from startup
                                        MVPs to enterprise applications. I believe in writing code that not only
                                        works but also creates meaningful experiences for users.
                                    </p>
                                    <p>
                                        When I'm not coding, you can find me exploring new technologies,
                                        contributing to open-source projects, or sharing knowledge with the
                                        developer community.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                {projectsStats.map((stat, index) => (
                                    <Card key={index} className="p-6 text-center">
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                            {stat.label}
                                        </div>
                                    </Card>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                <section className="py-16 bg-white dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Technical Expertise
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Comprehensive full-stack development skills to bring your vision to life
                            </p>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {skills.map((skill, index) => {
                                const Icon = skill.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <Card className="p-6 h-full">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-600 dark:text-purple-400">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                        {skill.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                        {skill.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {skill.technologies.map((tech, techIndex) => (
                                                            <span
                                                                key={techIndex}
                                                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                My Development Philosophy
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Principles that guide my work and approach to every project
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                    >
                                        <Card className="p-6 text-center h-full">
                                            <div className="flex justify-center mb-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-600 dark:text-purple-400">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {value.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {value.description}
                                            </p>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Process Section */}
       {/* // Development Process Section - Fixed Version */}
                <section className="py-16 bg-white dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Development Process
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                A structured approach to ensure project success from concept to deployment
                            </p>
                        </motion.div>

                        <div className="relative">
                            {/* Vertical timeline line - centered and responsive */}
                            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700"></div>

                            <div className="space-y-8 md:space-y-12">
                                {processSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="relative flex flex-col md:flex-row items-center md:items-start"
                                    >
                                        {/* Timeline dot - centered on mobile, aligned to timeline on desktop */}
                                        <div className="flex-shrink-0 relative z-10 mb-4 md:mb-0">
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                                                {step.step}
                                            </div>
                                        </div>

                                        {/* Content card - full width on mobile, half width on desktop with alternating sides */}
                                        <div className={`flex-1 w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr md:text-right' : 'md:pl md:text-left'} ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                                            <Card className="p-6">
                                                <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                                    {/* Number indicator for mobile */}
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white md:flex-1">
                                                        {step.title}
                                                    </h3>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 mt-3">
                                                    {step.description}
                                                </p>
                                            </Card>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Ready to Bring Your Idea to Life?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-8">
                                Let's collaborate to create something amazing. I'm passionate about turning
                                complex problems into elegant, user-friendly solutions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/contact"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-colors"
                                >
                                    Start a Project
                                </a>
                                <a
                                    href="/services"
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    View Services
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutPage;