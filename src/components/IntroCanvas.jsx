import  { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function IntroDroneModel() {
    const droneRef = useRef();
    const rotor1Ref = useRef();
    const rotor2Ref = useRef();
    const rotor3Ref = useRef();
    const rotor4Ref = useRef();

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();

        if (rotor1Ref.current && rotor2Ref.current && rotor3Ref.current && rotor4Ref.current) {
            rotor1Ref.current.rotation.y += delta * 50;
            rotor2Ref.current.rotation.y -= delta * 50;
            rotor3Ref.current.rotation.y += delta * 50;
            rotor4Ref.current.rotation.y -= delta * 50;
        }

        if (droneRef.current) {
            droneRef.current.position.x = Math.sin(time * 1.5) * 1.5;
            droneRef.current.position.z = Math.cos(time * 1.5) * 1.5 - 0.5;
            droneRef.current.position.y = Math.sin(time * 3) * 0.3 + 0.2;

            droneRef.current.rotation.z = Math.cos(time * 1.5) * 0.2;
            droneRef.current.rotation.x = Math.sin(time * 1.5) * 0.1;
            droneRef.current.rotation.y = time * 0.5;
        }
    });

    return (
        <group ref={droneRef} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
            <mesh castShadow>
                <boxGeometry args={[0.8, 0.35, 1.2]} />
                <meshStandardMaterial color="#1e1e2f" metalness={0.8} roughness={0.2} />
            </mesh>

            <mesh position={[0, -0.3, 0]} castShadow>
                <boxGeometry args={[0.5, 0.4, 0.7]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} roughness={0.2} />
            </mesh>

            <group rotation={[0, Math.PI / 4, 0]}>
                <mesh><boxGeometry args={[0.12, 0.1, 2.4]} /><meshStandardMaterial color="#374151" metalness={0.9} /></mesh>
            </group>
            <group rotation={[0, -Math.PI / 4, 0]}>
                <mesh><boxGeometry args={[0.12, 0.1, 2.4]} /><meshStandardMaterial color="#374151" metalness={0.9} /></mesh>
            </group>

            <group position={[0.85, 0.2, 0.85]}>
                <mesh><cylinderGeometry args={[0.15, 0.15, 0.15, 16]} /><meshStandardMaterial color="#111" /></mesh>
                <group ref={rotor1Ref} position={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[1.3, 0.03, 0.15]} /><meshStandardMaterial color="#c084fc" transparent opacity={0.9} /></mesh>
                </group>
            </group>
            <group position={[-0.85, 0.2, 0.85]}>
                <mesh><cylinderGeometry args={[0.15, 0.15, 0.15, 16]} /><meshStandardMaterial color="#111" /></mesh>
                <group ref={rotor2Ref} position={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[1.3, 0.03, 0.15]} /><meshStandardMaterial color="#c084fc" transparent opacity={0.9} /></mesh>
                </group>
            </group>
            <group position={[0.85, 0.2, -0.85]}>
                <mesh><cylinderGeometry args={[0.15, 0.15, 0.15, 16]} /><meshStandardMaterial color="#111" /></mesh>
                <group ref={rotor3Ref} position={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[1.3, 0.03, 0.15]} /><meshStandardMaterial color="#c084fc" transparent opacity={0.9} /></mesh>
                </group>
            </group>
            <group position={[-0.85, 0.2, -0.85]}>
                <mesh><cylinderGeometry args={[0.15, 0.15, 0.15, 16]} /><meshStandardMaterial color="#111" /></mesh>
                <group ref={rotor4Ref} position={[0, 0.1, 0]}>
                    <mesh><boxGeometry args={[1.3, 0.03, 0.15]} /><meshStandardMaterial color="#c084fc" transparent opacity={0.9} /></mesh>
                </group>
            </group>

            <pointLight position={[0, -0.5, 0.5]} color="#38bdf8" intensity={3} distance={5} />
        </group>
    );
}

const loadingSteps = [
    "CONNECTING TO SATELLITE LINK...",
    "CALIBRATING ROTOR ACTUATORS...",
    "SYNCING MEDICAL PAYLOAD SENSORS...",
    "LAUNCHING DIGITAL TWIN DASHBOARD..."
];

export default function IntroCanvas({ onFinish }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev) => {
                if (prev < loadingSteps.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsVisible(false);
                        if (onFinish) onFinish();
                    }, 500); // Brief pause on final step before hiding
                    return prev;
                }
            });
        }, 800);

        return () => clearInterval(interval);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 w-screen h-screen z-50 bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700">
            <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }} className="w-full h-full">
                <color attach="background" args={['#020617']} />
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 8, 5]} intensity={2.0} />
                <directionalLight position={[-5, -5, -5]} intensity={0.5} />
                <IntroDroneModel />
            </Canvas>

            <div className="absolute bottom-20 text-center flex flex-col items-center space-y-2 pointer-events-none z-50">
                <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 animate-pulse transition-all duration-500" style={{ width: `${(stepIndex + 1) * 25}%` }} />
                </div>
                <span className="text-sky-400 font-mono tracking-widest text-xs">
                    {loadingSteps[stepIndex]}
                </span>
            </div>
        </div>
    );
}