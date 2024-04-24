'use client';
import Link from "next/link";
import Box from "./components/Box";
import ContentArea from "./components/ContentArea";
import ButtonWell from "./components/buttons/ButtonWell";

export const SiteHeader = () => (
  <h1><Link href="/">Rainy Days Game Portal</Link></h1>
);

export default function Home() {
  return (
    <main>
      <Box className="inner-container">
        <SiteHeader />

        <ContentArea>
          <h2>Header</h2>

          <p>
            I am Raleway lalala I am Raleway la al al arlwea lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          <h3>Subheader</h3>

          <p>
            I am Raleway lalala I am Raleway la al al arlwea lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          <p>
            I am Raleway lalala I am Raleway la al al arlwea lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          <h4>Subsubheader</h4>
          <h5>Subsubsubheader</h5>
          <h6>Subsubsubsubheader</h6>

          <ButtonWell className="text-right pr-4 pb-4 absolute bottom-0 right-0" 
            actions={[{ label: "Join", onClick: () => alert("Joining...") }]}
            cancel={{ label: "Cancel" }}
            confirm={{ label: "OK" }}
          />
          
        </ContentArea>
      </Box>
    </main>
  );
}
