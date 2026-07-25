import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';


function DroneModel({ telemetry }) {
    const droneRef = useRef();
    const rotor1Ref = useRef();
    const rotor2Ref = useRef();
    const rotor3Ref = useRef();
    const rotor4Ref = useRef();

    useFrame((state, delta) => {

        if (rotor1Ref.current && rotor2Ref.current && rotor3Ref.current && rotor4Ref.current) {
            rotor1Ref.current.rotation.y += delta * 40;
            rotor2Ref.current.rotation.y -= delta * 40;
            rotor3Ref.current.rotation.y += delta * 40;
            rotor4Ref.current.rotation.y -= delta * 40;
        }


        if (droneRef.current) {
            const time = state.clock.elapsedTime;
            droneRef.current.position.y = 1.5 + Math.sin(time * 3) * 0.08;


            const targetRotationX = (telemetry?.speed || 0) * 0.01;
            droneRef.current.rotation.x = THREE.MathUtils.lerp(droneRef.current.rotation.x, targetRotationX, 0.1);
        }
    });

    return (
        <group ref={droneRef} position={[0, 1.5, 0]}>
            {/* --- CENTRAL CHASSIS / FUSELAGE --- */}
            <mesh castShadow>
                <boxGeometry args={[0.8, 0.3, 1.2]} />
                <meshStandardMaterial color="#181822" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* --- MEDICAL CARGO POD (BEACON GLOW) --- */}
            <mesh position={[0, -0.25, 0]} castShadow>
                <boxGeometry args={[0.5, 0.35, 0.7]} />
                <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
            </mesh>

            {/* --- ARMS --- */}
            <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[0.1, 0.08, 2.2]} />
                <meshStandardMaterial color="#2a2a3c" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
                <boxGeometry args={[0.1, 0.08, 2.2]} />
                <meshStandardMaterial color="#2a2a3c" metalness={0.9} />
            </mesh>

            {/* --- ROTORS & MOTORS --- */}
            {/* Front-Right Motor */}
            <group position={[0.8, 0.15, 0.8]}>
                <group ref={rotor1Ref} position={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[1.1, 0.02, 0.12]} /><meshStandardMaterial color="#a78bfa" transparent opacity={0.7} /></mesh>
                </group>
            </group>

            {/* Front-Left Motor */}
            <group position={[-0.8, 0.15, 0.8]}>
                <group ref={rotor2Ref} position={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[1.1, 0.02, 0.12]} /><meshStandardMaterial color="#a78bfa" transparent opacity={0.7} /></mesh>
                </group>
            </group>

            {/* Back-Right Motor */}
            <group position={[0.8, 0.15, -0.8]}>
                <group ref={rotor3Ref} position={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[1.1, 0.02, 0.12]} /><meshStandardMaterial color="#a78bfa" transparent opacity={0.7} /></mesh>
                </group>
            </group>

            {/* Back-Left Motor */}
            <group position={[-0.8, 0.15, -0.8]}>
                <group ref={rotor4Ref} position={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[1.1, 0.02, 0.12]} /><meshStandardMaterial color="#a78bfa" transparent opacity={0.7} /></mesh>
                </group>
            </group>

            {/* Status LED / Headlight */}
            <pointLight position={[0, -0.4, 0.5]} color="#10b981" intensity={2} distance={3} />
        </group>
    );
}

export default function DroneVisualizer3D({ telemetry }) {
    return (
        <div className="relative w-full h-[400px] bg-[#121218] border border-[#2a2a3c] rounded-2xl overflow-hidden shadow-2xl">

            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-[#181822]/95 border border-[#2a2a3c] backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-mono text-white tracking-wider uppercase">Live Digital Twin 3D View</span>
            </div>

            <Canvas camera={{ position: [4, 3, 5], fov: 50 }}>
                <color attach="background" args={['#0d0d12']} />
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />


                <Grid position={[0, 0, 0]} args={[20, 20]} cellSize={1} cellThickness={1} cellColor="#2a2a3c" sectionSize={5} sectionThickness={1.5} sectionColor="#4f46e5" fadeDistance={25} fadeStrength={1.5} />


                <DroneModel telemetry={telemetry} />


                <OrbitControls enablePan={true} enableZoom={true} maxPolarAngle={Math.PI / 2 - 0.05} minDistance={2} maxDistance={10} />
            </Canvas>
        </div>
    );
}