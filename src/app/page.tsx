'use client';
import Box from "./components/Box";
import ContentArea from "./components/ContentArea";
import ButtonWell from "./components/buttons/ButtonWell";

export default function Home() {
  return (
    <main>
      <Box className="inner-container">
        <h1>Rainy Days Game Portal</h1>

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

          <ButtonWell className="text-right pr-4" 
            action={{ label: "Join", onClick: () => alert("Joining...") }}
            cancel={{ label: "Cancel" }}
            confirm={{ label: "OK" }}
          />
          
        </ContentArea>
      </Box>
    </main>
  );
}
