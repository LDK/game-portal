import Box from "./Box";

const ContentArea = ({ children }: { children: React.ReactNode }) => (
  <Box className="content-area" px={4}>
    {children}
  </Box>
);
export default ContentArea;