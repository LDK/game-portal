// /app/games/babylon/components/Matrix/InnerChaser.tsx
import { useEffect, useState } from "react";
import * as BABYLON from "babylonjs";
import { colorSequence } from "./colorSequence";
import { ChaserPlaylist, getSequenceList } from "./sequence";

const MatrixInnerChaser = ({ size, interval, scene, playlist }:{ size:number, interval:number, scene?:BABYLON.Scene, playlist:ChaserPlaylist}) => {
  const [, setCurrentStep] = useState<number>(0);

  const sequenceList = getSequenceList(size);
  let finalSteps = sequenceList['faceRunBackwards'];

  useEffect(() => {
    const newSteps:string[] = [];

    playlist.forEach((sequence) => {
      for (let i = 0; i < (sequence.count || 1); i++) {
        newSteps.push(...(sequenceList[sequence.name] || []));
      }
    });

    finalSteps = newSteps;

  }, [sequenceList, playlist]);

  useEffect(() => {
    const flashCubeByName = (name: string, colorValue:number[], frames: number) => {
      if (!scene) { return; }
      // Find the cube by its unique name
      const cube = scene.getMeshByName(name) || undefined;
    
      if (cube && cube.material) {
        const material = cube.material as BABYLON.StandardMaterial;
    
        // Store the original color of the material
        const originalColor = material.diffuseColor.clone();
        const flashColor = BABYLON.Color3.FromArray(colorValue);
        
        // Create the keyframes for the animation
        const keyFrames = [
          { frame: 0, value: originalColor },      // Start with the original color (possibly still flashing from a previous animation)
          { frame: frames / 2, value: flashColor }, // Flash to next color quickly
          { frame: frames - 1, value: BABYLON.Color3.FromArray([0,0,1]) }      // Return to the default color
        ];
    
        // Create the animation for the color
        const colorAnimation = new BABYLON.Animation(
          "flashAnimation",         // Name of the animation
          "diffuseColor",           // Target property (material color)
          30,                       // Frames per second
          BABYLON.Animation.ANIMATIONTYPE_COLOR3,  // Color animation type
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT // No looping
        );
    
        const alphaAnimation = new BABYLON.Animation(
          "flashAlpha",         // Name of the animation
          "alpha",           // Target property (material color)
          30,                       // Frames per second
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,  // Color animation type
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT // No looping
        );
    
        const alphaFrames = [
          { frame: 0, value: material.alpha },      // Start with the original alpha
          { frame: frames / 2, value: .9 }, // Flash to full quickly
          { frame: frames - 1, value: .6 }      // Return to the default alpha
        ];
    
        alphaAnimation.setKeys(alphaFrames);
    
        // Set the keyframes for the animation
        colorAnimation.setKeys(keyFrames);
        // Set interpolation mode to LINEAR for smooth transitions
        // colorAnimation.setEasingFunction(new BABYLON.CubicEase());
    
        // Apply the animation to the material
        material.animations = material.animations || [];
        material.animations.push(colorAnimation);
        // material.animations.push(alphaAnimation);
    
        // Start the animation (start frame, end frame, no looping)
        scene.beginAnimation(material, 0, frames, false);
      }
    };
    
    const chaseInterval = setInterval(() => {
      setCurrentStep(prevStep => {
        const nextStep = prevStep + 1;
        if (nextStep > finalSteps.length - 1) {
          return 0;
        }

        flashCubeByName(finalSteps[prevStep], colorSequence[prevStep % colorSequence.length], 30);
        return nextStep;
      });
    }, interval);

    return () => {
      clearInterval(chaseInterval);
    };

  }, [interval, finalSteps, scene]);

  if (!scene) { return null; }

  return <></>;
};

export default MatrixInnerChaser;
