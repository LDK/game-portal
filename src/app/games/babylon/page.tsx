// app/games/babylon/page.tsx
'use client';
import React from 'react';
import Box from '@/app/components/Box';
import SiteHeader from '@/app/components/SiteHeader';
import ContentArea from '../../components/ContentArea';
import BabylonScene from './components/scene';
import { MaterialProps, useBabylon } from './useBabylon';
import GolfHole from './Golf/Hole';

export default function Babylon() {
    // Initialize Babylon.js scene
    const { canvasRef, addBox, addSphere, addCylinder, addGround, scene } = useBabylon();

    const mat = ():MaterialProps => {
      return {
        name: "mat",
        color: [Math.random(), Math.random(), Math.random()],
        alpha: Math.random(),
        type: 'standard'
      }
    };

    return (
        <main>
            <Box className="inner-container">
                <SiteHeader />
                <ContentArea>
                    <h2>Babylon</h2>
                    {/* Pass the canvasRef to the BabylonScene component */}
                    <Box className="w-50">
                      <BabylonScene canvasRef={canvasRef} />
                      {scene && <GolfHole scene={scene} canvasRef={canvasRef} addGround={addGround} />}
                    </Box>

                </ContentArea>
            </Box>
        </main>
    );
}
