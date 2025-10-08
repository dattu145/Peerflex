// src/pages/AboutPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Home,
    FileText,
    BookOpen,
    MessageCircle,
    Briefcase,
    Rocket,
    Calendar,
    GitBranch,
    GraduationCap,
    Target,
    Lightbulb,
    Globe,
    ArrowRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Header from '../components/layout/Header';

const AboutPage: React.FC = () => {
    const { language } = useAppStore();
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    const features = [
        {
            icon: Home,
            title: 'Room & Food Finder',
            description: 'Verified hostels, rooms, and local mess services tailored for students starting with Salem',
            color: 'text-orange-600 dark:text-orange-400'
        },
        {
            icon: FileText,
            title: 'Resume & Portfolio Builder',
            description: 'AI-powered templates to build, preview, and share personalized resumes and digital portfolios',
            color: 'text-blue-600 dark:text-blue-400'
        },
        {
            icon: BookOpen,
            title: 'Notes & Study Sharing',
            description: 'Subject-based repository where students share notes, guides, and resources collaboratively',
            color: 'text-green-600 dark:text-green-400'
        },
        {
            icon: MessageCircle,
            title: 'Chat & Networking',
            description: 'Connect with peers, classmates, or local students for collaboration and friendships',
            color: 'text-purple-600 dark:text-purple-400'
        },
        {
            icon: Briefcase,
            title: 'Job & Internship Hub',
            description: 'Auto job-apply system using n8n + curated part-time/student-friendly opportunities',
            color: 'text-indigo-600 dark:text-indigo-400'
        },
        {
            icon: Calendar,
            title: 'Events & Hangouts',
            description: 'Plan, discover, or join college events and local meetups across campuses',
            color: 'text-yellow-600 dark:text-yellow-400'
        },
        {
            icon: GitBranch,
            title: 'Open-Source Collaboration',
            description: 'Discover and contribute to beginner-friendly open-source projects with peers',
            color: 'text-gray-600 dark:text-gray-400'
        }
    ];

    const projectStats = [
        { value: 'All-in-One', label: 'Digital Ecosystem', icon: Rocket },
        { value: 'College', label: 'Students Focused', icon: Users },
        { value: 'Salem', label: 'Starting Location', icon: Target },
        { value: '7', label: 'Core Features', icon: Lightbulb }
    ];

    const values = [
        {
            icon: Users,
            title: 'Student-Centric',
            description: 'Designed exclusively for college students and their unique needs'
        },
        {
            icon: Rocket,
            title: 'Unified Platform',
            description: 'Bringing all essential student services under one seamless experience'
        },
        {
            icon: Target,
            title: 'Problem Solving',
            description: 'Solving real-world student problems from accommodation to career growth'
        },
        {
            icon: Lightbulb,
            title: 'Innovation',
            description: 'Leveraging technology to enhance student life and learning'
        }
    ];

    const visionSteps = [
        {
            step: '01',
            title: 'Salem Launch',
            description: 'Starting with colleges in Salem to perfect the platform and user experience'
        },
        {
            step: '02',
            title: 'Feature Expansion',
            description: 'Enhancing existing features and adding new capabilities based on user feedback'
        },
        {
            step: '03',
            title: 'Regional Growth',
            description: 'Expanding to other student hubs and cities across the region'
        },
        {
            step: '04',
            title: 'National Scale',
            description: 'Becoming India\'s largest student lifestyle and career ecosystem'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-600 mb-8"
                            >
                                <GraduationCap className="h-10 w-10 text-white" />
                            </motion.div>

                            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
                                Campus
                                <span className="bg-purple-600 bg-clip-text text-transparent">
                                    Pro
                                </span>
                            </h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
                            >
                                An all-in-one digital ecosystem designed exclusively for college students,
                                helping them live smarter, learn collaboratively, and grow professionally.
                            </motion.p>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="pb-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {projectStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        className="text-center group"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
                                                <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-300 font-medium">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Features Section - Clean Layout */}
                <section className="py-16 bg-white dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Comprehensive Student Platform
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Everything students need for academic success and campus life in one place
                            </p>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-20"
                        >
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ y: -5 }}
                                        onHoverStart={() => setHoveredFeature(index)}
                                        onHoverEnd={() => setHoveredFeature(null)}
                                        className="text-center"
                                    >
                                        <div className="flex justify-center mb-6">
                                            <div className={`p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 transition-colors ${hoveredFeature === index ? 'bg-purple-100 dark:bg-purple-900/30' : ''}`}>
                                                <Icon className={`h-8 w-8 ${feature.color}`} />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Values Section - Clean Layout */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Our Approach
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Principles that guide our platform development and student focus
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {values.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="text-center"
                                    >
                                        <div className="flex justify-center mb-6">
                                            <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                                                <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Vision Timeline Section - Clean Layout */}
                <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Growth Roadmap
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Our journey to become India's largest student lifestyle and career ecosystem
                            </p>
                        </motion.div>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200 dark:bg-purple-700 rounded-full"></div>

                            <div className="space-y-12 lg:space-y-16">
                                {visionSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.2 }}
                                        className="relative"
                                    >
                                        {/* Mobile Layout */}
                                        <div className="lg:hidden flex items-start space-x-6">
                                            <div className="flex-shrink-0 relative z-10">
                                                <div className="w-12 h-12 rounded-full bg-purple-600 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">{step.step}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Desktop Layout */}
                                        <div className="hidden lg:flex items-center justify-center">
                                            {/* Left Side Content */}
                                            <div className={`flex-1 ${index % 2 === 0 ? 'pr-12 text-right' : 'invisible'}`}>
                                                {index % 2 === 0 && (
                                                    <motion.div
                                                        whileHover={{ x: -10 }}
                                                        className="inline-block max-w-lg"
                                                    >
                                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                                            {step.title}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Center Timeline Dot */}
                                            <div className="flex-shrink-0 relative z-10 mx-8">
                                                <div className="w-12 h-12 rounded-full bg-purple-600 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                                                    <span className="text-white font-bold">{step.step}</span>
                                                </div>
                                            </div>

                                            {/* Right Side Content */}
                                            <div className={`flex-1 ${index % 2 !== 0 ? 'pl-12 text-left' : 'invisible'}`}>
                                                {index % 2 !== 0 && (
                                                    <motion.div
                                                        whileHover={{ x: 10 }}
                                                        className="inline-block max-w-lg"
                                                    >
                                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                                            {step.title}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Target Audience Section */}
                <section className="py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex justify-center mb-6">
                                <Globe className="h-12 w-12 text-purple-600" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Target Audience
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                                <div className="text-center">
                                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">College Students</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        From first-year freshers to final-year graduates
                                    </p>
                                </div>
                                <div className="text-center">
                                    <Home className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Hostel/PG Owners</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        Accommodation and service providers
                                    </p>
                                </div>
                                <div className="text-center">
                                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Campus Clubs</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        Event organizers and club coordinators
                                    </p>
                                </div>
                                <div className="text-center">
                                    <Briefcase className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Employers</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        Companies seeking student talent
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutPage;