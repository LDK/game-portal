// /app/games/babylon/components/Golf/Hole.tsx

import "@babylonjs/loaders";
import { useEffect } from "react";
import { GroundProps, MaterialProps, MeshProps } from "../useBabylon";
import * as BABYLON from 'babylonjs';
import * as CANNON from 'cannon';

interface GolfHoleProps {
  scene: BABYLON.Scene;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  addGround: (props: Omit<MeshProps & GroundProps, 'type'>) => BABYLON.Mesh | undefined;
}

if (typeof window !== 'undefined') {
  window.CANNON = CANNON;
}

const grassMaterial:MaterialProps = {
  name: 'grass',
  type: 'standard',
  color: [0.2, 0.8, 0.2],
  specular: [0, 0, 0],
  roughness: 1
};

// Simple Perlin noise function for generating subtle hills
const  perlinNoise = (x:number, z:number, factor:number = .01) => {
  // A very basic pseudo-random noise function for demonstration purposes
  return (Math.sin(x * 0.1) + Math.cos(z * 0.1)) * factor;
}

const GolfHole = ({ scene, addGround, canvasRef }: GolfHoleProps) => {
  useEffect(() => {
    const drawGolfHole = () => {
      scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

      const existingGolfBall = scene.getMeshByName('golfBall');
      if (existingGolfBall) {
        existingGolfBall.dispose();
      }

      // const golfHoleParent = new BABYLON.TransformNode('golfHoleParent', scene);

      // const ground = addGround({
      //   name: 'golfCourse',
      //   position: [0, 0, 0],
      //   rotation: [0, 0, 0],
      //   scaling: [1, 1, 1],
      //   width: 350,
      //   height: 350,
      //   subdivisions: 5,
      //   material: grassMaterial,
      //   parent: golfHoleParent
      // });

      const existingGround = scene.getMeshByName('ground');
      if (existingGround) {
        existingGround.dispose();
      }

      var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -1.5, -1), scene);
      light.position = new BABYLON.Vector3(-50, 200, -50); // Position the light high above the scene
      light.intensity = 1.25;

      // Our built-in 'ground' shape.
      // 1 unit of size = 1 yard
      const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 350, height: 350, subdivisions: 100 }, scene);

      if (!ground) { return; }

      // ground.parent = golfHoleParent;

      // Manipulate vertex data to create subtle hills
      const vertexData = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);

      for (let i = 0; vertexData && i < vertexData.length; i += 3) {
        vertexData[i + 1] += perlinNoise(vertexData[i], vertexData[i + 2], 5) * 0.5; // Adjust multiplier for subtle hills
      }

      if (vertexData) {
        // ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, vertexData);
        ground.setVerticesData(BABYLON.VertexBuffer.PositionKind, vertexData);
      }

      console.log('ground', ground);

      // Create a material for the terrain
      const terrainMaterial = new BABYLON.StandardMaterial("terrainMat", scene);
      terrainMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Green color for the terrain
      terrainMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Remove shininess
      terrainMaterial.roughness = 1; // Increase roughness to make it less reflective
      ground.material = terrainMaterial;

      // const ground2 = BABYLON.MeshBuilder.CreateGround('ground2', { width: 350, height: 350, subdivisions: 100 }, scene);
      // ground2.position = new BABYLON.Vector3(0, -80, 0);
      // ground2.material = terrainMaterial;
      // ground2.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, {
      //   mass: 0,
      //   restitution: 0.3,
      //   friction: 0.9
      // }, scene);

      // Make the ground receive shadows
      ground.receiveShadows = true;

      // This creates and positions a free camera (non-mesh)
      var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 60, -330), scene);
      console.log('camera', camera);
      // This attaches the camera to the canvas
      camera.attachControl(canvasRef, true);
      scene.activeCamera = camera;

      // Add a sphere as a placeholder for the golf ball
      const golfBall = BABYLON.MeshBuilder.CreateSphere('golfBall', { diameter: 4.7 }, scene);
      golfBall.position = new BABYLON.Vector3(0, 10, 0);
      golfBall.material = new BABYLON.StandardMaterial('golfBallMaterial', scene);

      // Create a physics impostor for the golf ball
      golfBall.physicsImpostor = new BABYLON.PhysicsImpostor(golfBall, BABYLON.PhysicsImpostor.SphereImpostor, {
        mass: 0.04593,
        restitution: 0.6,
        friction: 22
      }, scene);

      const ballMaterial = new BABYLON.StandardMaterial('ballMaterial', scene);
      ballMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);

      // let golfBall: BABYLON.AbstractMesh;

      // Set camera target to the golf ball
      camera.setTarget(golfBall.position);
      golfBall.physicsBody?.setLinearDamping(1.5); // Slow down the ball over time

      // Set up shadow generator
      var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
      shadowGenerator.addShadowCaster(golfBall);
      shadowGenerator.useBlurExponentialShadowMap = true; // Use a blurred shadow map for softer shadows
      shadowGenerator.blurScale = 2;
      // });
      //   mass: 0.04593,
      //   restitution: 0.6,
      //   friction: 22
      // }, scene);

      if (golfBall) {
        // Set up shadow generator
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.addShadowCaster(golfBall);
        shadowGenerator.useBlurExponentialShadowMap = true; // Use a blurred shadow map for softer shadows
        shadowGenerator.blurScale = 2;
      }

      // Add a physics impostor to the ground
      ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, {
        mass: 0,
        restitution: 0.3,
        friction: 23.9,
      }, scene);

      const slowFactor = 0.95;
      
      console.log('slowFactor', slowFactor);

    };

    drawGolfHole();
  }, [scene]);

  return <></>;
};

export default GolfHole;