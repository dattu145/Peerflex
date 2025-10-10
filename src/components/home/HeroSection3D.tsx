// src/components/HeroSection3D.tsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { GraduationCap, ArrowRight } from 'lucide-react';

// Three.js Background Component
const AnimatedBackground = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
            meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.05;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -5]}>
            <icosahedronGeometry args={[2, 1]} />
            <meshStandardMaterial 
                color="#8b5cf6" 
                wireframe 
                transparent 
                opacity={0.1}
            />
        </mesh>
    );
};

// Floating Icons for Hero Section
const FloatingIcons = () => {
    const iconsRef = useRef<THREE.Group>(null);
    
    useEffect(() => {
        if (iconsRef.current) {
            gsap.to(iconsRef.current.rotation, {
                y: Math.PI * 2,
                duration: 20,
                repeat: -1,
                ease: "none"
            });
        }
    }, []);

    return (
        <group ref={iconsRef}>
            {/* Floating academic icons around the main text */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.5} floatIntensity={1}>
                    <mesh position={[
                        Math.cos((i / 6) * Math.PI * 2) * 3,
                        Math.sin((i / 6) * Math.PI * 2) * 2,
                        -1
                    ]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color={i % 2 === 0 ? "#6366f1" : "#8b5cf6"} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

interface HeroSection3DProps {
    onExploreClick?: () => void;
}

const HeroSection3D: React.FC<HeroSection3DProps> = ({ onExploreClick }) => {
    const heroRef = useRef<HTMLDivElement>(null);

    // GSAP Animations
    useEffect(() => {
        // Hero section animation
        gsap.fromTo(heroRef.current, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
        );
    }, []);

    const handleExploreClick = () => {
        if (onExploreClick) {
            onExploreClick();
        } else {
            // Default scroll behavior
            gsap.to(window, { 
                duration: 1, 
                scrollTo: "#features", 
                ease: "power2.inOut" 
            });
        }
    };

    return (
        <section className="relative overflow-hidden flex items-center justify-center py-32 md:py-40">
            {/* Three.js Canvas Background */}
            <div className="absolute inset-0 dark:bg-gray-800">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <AnimatedBackground />
                    <FloatingIcons />
                    <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
            </div>
            
            {/* Content */}
            <div ref={heroRef} className="relative z-10 text-center px-4 sm:px-6 max-w-7xl mx-auto w-full">
                {/* Logo/Icon */}
                <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600 mb-6 sm:mb-8"
                >
                    <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight"
                >
                    Peer
                    <span className="text-purple-600 sm:inline">
                        flex
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-4 sm:mt-6 md:mt-8 text-base xs:text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2"
                >
                    An all-in-one digital ecosystem designed exclusively for college students,
                    helping them live smarter, learn collaboratively, and grow professionally.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-8 sm:mt-10 md:mt-12"
                >
                    <button 
                        onClick={handleExploreClick}
                        className="group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Explore Platform
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>

            {/* Scroll Indicator for larger screens */}
            <motion.div
                className="hidden sm:flex absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-purple-600 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-3 bg-purple-600 rounded-full mt-2"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection3D;