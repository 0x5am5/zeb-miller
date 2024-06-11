import { ReactNode, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  Instance,
  Instances,
  SoftShadows,
  useScroll,
  Scroll,
  ScrollControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { easing } from "maath";
import { Leaves } from "./assets/Falling_leaves";
import { Flowers } from "./assets/Assignment4_flowersfbx";

export default function App() {
  return (
    <Canvas dpr={0.5} shadows>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight
        castShadow
        position={[5, 5, 30]}
        intensity={1}
        shadow-mapSize={2048}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-15, 15, 15, -15, 1, 50]}
        />
      </directionalLight>
      <ScrollControls prepend pages={2} damping={0.25}>
        <Scroll>
          <Cam />
        </Scroll>
        <Scroll html>
          <div
            style={{ position: "absolute", width: "100vw", height: "100vh" }}
          >
            <div className="char" style={{ top: 80, left: 80 }}>
              P
            </div>
            <div
              className="char"
              style={{ top: 80, left: "calc(80px + 15vw)" }}
            >
              M
            </div>
            <div
              className="char"
              style={{ top: 80, left: "calc(80px + 35vw)" }}
            >
              N
            </div>
            <div
              className="char"
              style={{
                top: "calc(80px + 17.5vw)",
                left: "calc(80px + 15vw)",
              }}
            >
              D
            </div>
            <div
              className="char"
              style={{ bottom: 80, left: "calc(80px + 35vw)" }}
            >
              R
            </div>
            <div
              className="char"
              style={{ bottom: 80, left: "calc(80px + 50vw)" }}
            >
              S
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "100vh",
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 80,
                left: 80,
                fontSize: "15px",
              }}
            >
              <br />
              lamps —
              <br />
              IEC61966-2.1
              <br />
              1400 × 2100
            </div>
            <div
              style={{
                width: "40vw",
                height: "calc(100vh - 0px)",
                backgroundImage: "url(/img3.jpg)",
                backgroundSize: "cover",
              }}
            />
            <div className="char" style={{ bottom: 80, right: 80 }}>
              1
            </div>
          </div>
        </Scroll>
        <Center rotation={[0, 0.5, 0]} position={[-10, 0, 20]}>
          <Blinds />
        </Center>
      </ScrollControls>
      <Leaves position={[0, -8, 10]} scale={40} />
      <Flowers position={[9, -0.5, 8]} rotation={[0, 0, 0.6]} scale={1.3} />
      <mesh
        receiveShadow
        scale={50}
        position={[0, 0, -0]}
        rotation={[0, 0.1, 0]}
      >
        <planeGeometry />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
      <SoftShadows size={15} focus={0} samples={32} />
    </Canvas>
  );
}

function Cam({ children }: { children?: ReactNode }) {
  const ref = useRef<any>();
  useFrame((state, delta) => {
    easing.damp3(
      ref.current.position,
      [state.pointer.x / 2, state.pointer.y / 2, 5],
      0.5,
      delta
    ); // Move camera
    ref.current.lookAt(0, 0, -100);
    ref.current.updateProjectionMatrix();
  });
  return (
    <PerspectiveCamera makeDefault ref={ref} position={[0, 0, 5]} fov={75}>
      {children}
    </PerspectiveCamera>
  );
}

function Blinds({ howmany = 50, ...props }) {
  const ref = useRef<any>();
  const scroll = useScroll();
  useFrame(() => {
    ref.current.children.forEach((child: any) => {
      child.rotation.x = 0.5 + scroll.offset / 1.5;
      child.rotation.z = -0.2;
      child.rotation.y = scroll.offset / 10;
    });
  });
  return (
    <Instances castShadow {...props}>
      <boxGeometry />
      <meshBasicMaterial />
      <group ref={ref}>
        {Array.from({ length: howmany }, (_, i) => (
          <Instance
            key={i}
            position={[0, i, 0]}
            scale={[100, 0.9, 0.01]}
            rotation={[0.5, 0, 0]}
          />
        ))}
      </group>
      <Instance position={[18, howmany / 2, 0]} scale={[0.2, howmany, 0.01]} />
    </Instances>
  );
}
