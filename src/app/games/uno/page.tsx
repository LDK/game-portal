// app/uno.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ButtonWell from '../../components/buttons/ButtonWell';
import ContentArea from '../../components/ContentArea';
import Box from '@/app/components/Box';
import { SiteHeader } from '../../page';
import { CardColor, PlayingCardUno, UnoDeck, buildDeck, deal, playableCards, shuffleDeck } from './cards';
import { useRouter } from 'next/navigation';

export default function Uno() {
    const [inGame, setInGame] = useState<boolean>(false);
    const router = useRouter();

    return (
        <main>
          <Box className="inner-container">
            <SiteHeader />
              <ContentArea>
                <h2>Uno</h2>

                <ButtonWell actions={[
                  { label: "New Game", onClick: () => { router.push('/uno/game/1'); } }
                ]} />
              </ContentArea>
          </Box>
        </main>
    );
}
