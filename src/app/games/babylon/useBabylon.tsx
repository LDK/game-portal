// app/games/babylon/useBabylon.tsx
import { useRef, useEffect, useState } from "react";
import * as BABYLON from "babylonjs";

export type Vector3 = [number, number, number];

export type MaterialProps = {
  name: string;
  type: 'standard' | 'pbr' | 'shader' | 'custom';
  color?: Vector3;
  specular?: Vector3;
  emissive?: Vector3;
  rimColor?: Vector3;
  alpha?: number;
  scene?: BABYLON.Scene;
  roughness?: number;
  custom?: any;
  metadata?: any;
}

export type ObjectProps = {
  name: string;
  position: Vector3;
  rotation?: Vector3;
  scaling?: Vector3;
  material?: MaterialProps;
  parent?: BABYLON.Node;
  // size?: number;
}

type BoxProps = {
  size: number;
} & ObjectProps;

type SphereProps = {
  diameter: number;
} & ObjectProps;

type PlaneProps = {
  size: number;
} & ObjectProps;

type CylinderProps = {
  height: number;
  diameter: number;
  diameterTop: number;
} & ObjectProps;

type TorusProps = {
  diameter: number;
  thickness: number;
} & ObjectProps;

export type GroundProps = {
  width: number;
  height: number;
  subdivisions?: number;
} & ObjectProps;

export type MeshProps = {
  type: 'box' | 'sphere' | 'plane' | 'cylinder' | 'torus' | 'ground';
} & (BoxProps | SphereProps | PlaneProps | CylinderProps | TorusProps | GroundProps);

// Lights

type HemisphericLightProps = {
  direction: number[];
  intensity: number;
}

type DirectionalLightProps = {
  direction: number[];
  intensity: number;
}

type PointLightProps = {
  position: number[];
  intensity: number;
}

type SpotLightProps = {
  position: number[];
  direction: number[];
  intensity: number;
  angle: number;
  exponent: number;
}

export type LightProps = {
  parent?: BABYLON.TransformNode;
  type: 'hemispheric' | 'directional' | 'point' | 'spot';
} & (HemisphericLightProps | DirectionalLightProps | PointLightProps | SpotLightProps);

// Cameras

type FreeCameraProps = {
  speed: number;
}

type ArcCameraProps = {
  alpha: number;
  beta: number;
  radius: number;
}

export type CameraProps = {
  type: 'free' | 'arc' | 'follow' | 'vr';
  position: Vector3;
  target: number[];
} & (FreeCameraProps | ArcCameraProps | undefined); // Follow and VR cameras don't have additional props

export type SceneItem = {
  type: 'mesh' | 'camera' | 'light' | 'animation' | 'sound' | 'particle' | 'physics' | 'gui' | 'skybox';
  props: MeshProps | CameraProps | LightProps | undefined; // Other types not yet implemented
}

const createMaterial = ({ color, alpha, scene }:MaterialProps) => {
  const material = new BABYLON.StandardMaterial("boxMaterial", scene);

  if (color) {
    material.diffuseColor = new BABYLON.Color3(color[0] || 0, color[1] || 0, color[2] || 0);
  }

  if (alpha) {
    material.alpha = alpha;
  }

  // material.backFaceCulling = true;

  return material;
}

export const rotateEmptyNode = (node: BABYLON.TransformNode, scene: BABYLON.Scene, frames = 480, loop = true) => {
  const animation = new BABYLON.Animation(
      "rotationAnimation", 
      "rotation.y",  // The property to animate (Y-axis rotation)
      30,            // Frames per second
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,  // The type of value to animate
      loop ? BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE : BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT // Loop the animation or not
  );

  // Define keyframes for the animation (0 -> 0 degrees, 100 -> 360 degrees)
  const keyFrames = [
      { frame: 0, value: 0 },         // At frame 0, rotation is 0 radians
      { frame: frames - 1, value: Math.PI * 2 } // At frame 100, rotation is 360 degrees (2*PI radians)
  ];

  animation.setKeys(keyFrames);
  // Set interpolation mode to LINEAR for smooth transitions
  animation.setEasingFunction(new BABYLON.BezierCurveEase(0.02, 0.01, 0.98, 0.99));

  // Apply the animation to the node
  node.animations = node.animations || [];
  node.animations.push(animation);

  // Begin the animation (start at frame 0, end at frame 100, loop, and start immediately)
  scene.beginAnimation(node, 0, frames, true);
};

export const useBabylon = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [scene, setScene] = useState<BABYLON.Scene | undefined>(undefined);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize Babylon.js engine and scene
        const engine = new BABYLON.Engine(canvasRef.current, true);
        const scene:BABYLON.Scene = new BABYLON.Scene(engine);
        console.log('scene', scene);
    
    
        setScene(scene || undefined);

        // Basic camera and light setup
        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -12.5), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvasRef.current, true);

        // const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        // light.intensity = 5;

        // Render loop
        engine.runRenderLoop(() => {
            scene.onBeforeStepObservable.add(() => {
              console.log('obsr');
              // if (golfBall && golfBall.physicsImpostor) {
              //   const velocity = golfBall.physicsImpostor.getAngularVelocity() || new BABYLON.Vector3(0, 0, 0);
              //   console.log('velocity', velocity);
              //   golfBall.physicsImpostor.setAngularVelocity(velocity.scale(.1));
              // }
            });
              scene.render();
        });

        // Handle window resize
        window.addEventListener("resize", () => {
            engine.resize();
        });

        // Clean up when component unmounts
        return () => {
            scene.dispose();
            engine.dispose();
        };
    }, []);

    const addEmpty = (props: Omit<ObjectProps, 'material'>) => {
      const { name, position, rotation = [0, 0, 0], scaling = [1, 1, 1] } = props;
      if (scene) {
          const empty = new BABYLON.TransformNode(name, scene);
          empty.position = new BABYLON.Vector3(position[0], position[1], position[2]);
          empty.rotation = new BABYLON.Vector3(rotation[0], rotation[1], rotation[2]);
          empty.scaling = new BABYLON.Vector3(scaling[0], scaling[1], scaling[2]);
          return empty;
      }
    }

    const addBox = (props: Omit<MeshProps, 'type'>) => {
      const { material, name, parent, size = 1, position = [0, 0, 0] } = props as (MeshProps & BoxProps);
      if (scene) {
          const box = BABYLON.MeshBuilder.CreateBox(name || "box", { size: size }, scene);
          box.position = new BABYLON.Vector3(position[0], position[1], position[2]);

          if (material) {
              const boxMaterial = createMaterial(material);
              box.material = boxMaterial;
          }

          if (parent) {
              box.parent = parent as BABYLON.TransformNode;
          }

          return box;
      }
    };

    const addLight = (props: LightProps):(BABYLON.Light | undefined) => {
      const { type, intensity, parent } = props;
      if (scene) {
          switch (type) {
              case 'hemispheric': {
                  const { direction } = props as HemisphericLightProps;
                  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(direction[0], direction[1], direction[2]), scene);
                  light.intensity = intensity;

                  if (parent) { light.parent = parent; }

                  return light;
              }
              case 'directional': {
                  const { direction } = props as DirectionalLightProps;
                  const light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(direction[0], direction[1], direction[2]), scene);
                  light.intensity = intensity;

                  if (parent) { light.parent = parent; }
                  
                  return light;
              }
              case 'point': {
                  const { position } = props as PointLightProps;
                  const light = new BABYLON.PointLight("light", new BABYLON.Vector3(position[0], position[1], position[2]), scene);
                  light.intensity = intensity;

                  if (parent) { light.parent = parent; }

                  return light;
              }
              case 'spot': 
              default: {
                  const { position, direction, intensity, angle, exponent } = props as SpotLightProps;
                  const light = new BABYLON.SpotLight("light", new BABYLON.Vector3(position[0], position[1], position[2]), new BABYLON.Vector3(direction[0], direction[1], direction[2]), angle, exponent, scene);
                  light.intensity = intensity;

                  if (parent) { light.parent = parent; }

                  return light;
              }
          }
      }
    }

    const addSphere = (props: Omit<MeshProps, 'type'>) => {
      const { material, name, parent, diameter = 1, position = [0, 0, 0] } = props as (MeshProps & SphereProps);
      if (scene) {
          const sphere = BABYLON.MeshBuilder.CreateSphere(name || "sphere", { diameter }, scene);
          sphere.position = new BABYLON.Vector3(position[0], position[1], position[2]);

          if (material) {
              const sphereMaterial = createMaterial(material);
              sphere.material = sphereMaterial;
          }

          if (parent) {
              sphere.parent = parent;
          }

          return sphere;
      }
    }

    const addCylinder = (props: Omit<MeshProps, 'type'>) => {
      const { material, parent, name, height = 1, diameter = 1, diameterTop = diameter, position = [0, 0, 0] } = props as (MeshProps & CylinderProps);
      if (scene) {
          const cylinder = BABYLON.MeshBuilder.CreateCylinder(name || "cylinder", { height, diameter, diameterTop }, scene);
          cylinder.position = new BABYLON.Vector3(position[0], position[1], position[2]);

          if (material) {
              const cylinderMaterial = createMaterial(material);
              cylinder.material = cylinderMaterial;
          }

          if (parent) {
              cylinder.parent = parent;
          }
      }
    }
  
    const addGround = (props: Omit<MeshProps & GroundProps, 'type'>) => {
      const { material, parent, name, width = 1, height = 1, subdivisions = 1, position = [0, 0, 0] } = props as (MeshProps & GroundProps);
      if (scene) {
          const ground = BABYLON.MeshBuilder.CreateGround(name || "ground", { width: width, height: height, subdivisions }, scene);
          ground.position = new BABYLON.Vector3(position[0], position[1], position[2]);

          if (material) {
              const groundMaterial = createMaterial(material);
              ground.material = groundMaterial;
          }

          if (parent) {
              ground.parent = parent;
          }

          return ground;
      }
    };

    return { canvasRef, rotateEmptyNode, scene, addBox, addSphere, addCylinder, addEmpty, addLight, addGround };
};
