'use client';
import Box from "@/app/components/Box";
import ContentArea from "@/app/components/ContentArea";
import SiteHeader from "./components/SiteHeader";
import { useEffect, useState } from "react";
import { GameTitle } from "./types/types";
import useApi from "./hooks/useApi";



export default function Home() {
  const [titles, setTitles] = useState<GameTitle[]>([]);

  const { apiGet } = useApi();

  useEffect(() => {
    apiGet({ 
      uri: 'http://localhost:8000/titles',
      sendAuth: false,
      onSuccess: (res) => {
        setTitles(res.data);
      },
      onError: (error) => {
        console.error('API call error:', error);
      }
    });
  }, []);

  return (
    <main>
      <Box className="inner-container">
        <SiteHeader />

        <ContentArea>
          <h2>Header</h2>

          <p>
            I am Raleway lalala I am Raleway la al al arlwea lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          <h3>Games</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3">
            {titles.map((title, index) => (
              <div key={index} className="game-card pr-2">
                <a key={index} href={title.url} className="game-link">
                  <h4>{title.title}</h4>
                  <p>{title.description}</p>
                </a>
              </div>
            ))}
          </div>

        </ContentArea>
      </Box>
    </main>
  );
}
