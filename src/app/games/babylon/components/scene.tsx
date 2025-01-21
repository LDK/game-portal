// /app/games/babylon/components/scene.tsx
import React from "react";

interface BabylonSceneProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const BabylonScene: React.FC<BabylonSceneProps> = ({ canvasRef }) => {
    return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default BabylonScene;
