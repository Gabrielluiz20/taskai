import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';

// Uma "ficha de tarefa" flutuando em 3D, com um cantinho colorido
// (a mesma linguagem visual do carimbo de prioridade usado no app).
function FloatingCard({ position, rotation, color, speed }) {
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <group position={position} rotation={rotation}>
        {/* corpo da ficha */}
        <mesh>
          <planeGeometry args={[1.4, 1.9]} />
          <meshStandardMaterial color="#FFFDF8" side={2} />
        </mesh>
        {/* borda sutil */}
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[1.46, 1.96]} />
          <meshStandardMaterial color="#C9CFC7" side={2} />
        </mesh>
        {/* cantinho colorido, como o carimbo de urgência */}
        <mesh position={[0.5, 0.75, 0.001]}>
          <planeGeometry args={[0.35, 0.12]} />
          <meshStandardMaterial color={color} side={2} />
        </mesh>
        {/* linhas simulando texto */}
        {[0.3, 0.05, -0.2].map((y, i) => (
          <mesh key={i} position={[-0.15, y, 0.001]}>
            <planeGeometry args={[0.9, 0.06]} />
            <meshStandardMaterial color="#E4E2D8" side={2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

const CARTOES = [
  { position: [-2.4, 0.6, -1], rotation: [0, 0.3, -0.15], color: '#B23A1F', speed: 1.2 },
  { position: [2.2, -0.4, -0.5], rotation: [0, -0.25, 0.1], color: '#C68A1D', speed: 1.6 },
  { position: [0, 1.2, -2], rotation: [0.1, 0, -0.08], color: '#2F6F4E', speed: 1.0 },
  { position: [-1.4, -1, -1.5], rotation: [-0.1, 0.15, 0.12], color: '#2F6F4E', speed: 1.4 },
  { position: [1.6, 1, -1.8], rotation: [0.05, -0.1, -0.1], color: '#B23A1F', speed: 0.9 },
  { position: [0.3, -1.3, -0.8], rotation: [-0.05, 0.2, 0.05], color: '#C68A1D', speed: 1.3 },
];

export default function LandingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 50 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} />
      {CARTOES.map((c, i) => (
        <FloatingCard key={i} {...c} />
      ))}
    </Canvas>
  );
}