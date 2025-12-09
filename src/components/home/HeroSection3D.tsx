// src/components/home/HeroSection3D.tsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { GraduationCap, ArrowRight } from 'lucide-react';

// Three.js Background Component - Auto-rotating with continuous loop
const AnimatedBackground = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Continuous rotation in a loop
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.002;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 9]}> {/* Moved further back */}
            <icosahedronGeometry args={[1.2, 1]} /> {/* Smaller to prevent cutting */}
            <meshStandardMaterial
                color="#8b5cf6"
                wireframe
                transparent
                opacity={0.6}
            />
        </mesh>
    );
};

// Floating Icons for Hero Section - Auto-rotating with proper positioning
const FloatingIcons = () => {
    const iconsRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (iconsRef.current) {
            gsap.to(iconsRef.current.rotation, {
                y: Math.PI * 2,
                duration: 25, // Slower rotation to prevent fast movement
                repeat: -1,
                ease: "none"
            });
        }
    }, []);

    return (
        <group ref={iconsRef}>
            {/* Floating academic icons - positioned well within view */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <Float
                    key={i}
                    speed={1.5 + i * 0.3} // slower speed
                    rotationIntensity={20}
                    floatIntensity={0.8}
                >
                    <mesh position={[
                        Math.cos((i / 6) * Math.PI * 2) * 5, // Smaller radius to prevent cutting
                        Math.sin((i / 6) * Math.PI * 2) * 1.5, // Smaller radius
                        5 // Closer to camera but within bounds
                    ]}>
                        <sphereGeometry args={[0.08, 16, 16]} /> {/* Smaller spheres */}
                        <meshStandardMaterial
                            color={i % 2 === 0 ? "#6366f1" : "#8b5cf6"}
                            transparent
                            opacity={1}
                        />
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
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section
            className="relative overflow-hidden flex items-center justify-center py-32 md:py-40 bg-transparent min-h-screen w-full"
            style={{ background: 'transparent' }}
        >
            {/* Three.js Canvas Background - FULL WIDTH with proper sizing */}
            <div className="absolute inset-0 z-0 bg-transparent w-full h-full left-0 right-0">
                <Canvas
                    camera={{
                        position: [0, 0, 11], // Further back camera
                        fov: 75, // Wider field of view to see more
                        near: 0.1,
                        far: 1000
                    }}
                    style={{
                        pointerEvents: 'none',
                        background: 'transparent',
                        width: '100vw',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                    gl={{
                        alpha: true,
                        antialias: true,
                        preserveDrawingBuffer: false,
                        powerPreference: "high-performance"
                    }}
                    onCreated={({ gl, scene }) => {
                        gl.setClearColor(0x000000, 0); // Fully transparent
                        scene.background = null; // Remove scene background
                    }}
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[8, 8, 8]} intensity={0.6} />
                    <pointLight position={[-8, -8, 6]} intensity={0.4} color="#6366f1" />
                    <AnimatedBackground />
                    <FloatingIcons />
                </Canvas>
            </div>

            {/* Content - positioned above the canvas */}
            <div ref={heroRef} className="relative z-10 text-center px-4 sm:px-6 max-w-7xl mx-auto w-full">
                {/* Logo/Icon */}
                <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600 mb-6 sm:mb-8 backdrop-blur-sm border border-purple-400/30"
                >
                    <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-5xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-purple-700 dark:text-white leading-tight drop-shadow-2xl">
                    Peer
                    <span className="sm:inline text-gray-700 dark:text-purple-400">
                        flex
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-4 sm:mt-6 md:mt-8 text-base xs:text-lg sm:text-xl md:text-2xl text-black/90 dark:text-white/90 max-w-3xl mx-auto leading-relaxed px-2 drop-shadow-lg backdrop-blur-sm"
                >
                    A platform designed exclusively for college students,
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
                        className="group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white bg-purple-600/90 hover:bg-purple-700/90 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-2xl backdrop-blur-sm border border-purple-400/30 rounded-2xl"
                    >
                        Explore Platform
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection3D;