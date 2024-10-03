import ResultTree from "@/components/ResultTree";
import Sidebar from "@/components/Sidebar";
import { Container, Sheet } from "@mui/joy";
import { Typography } from "@mui/material";

const SIDEBAR_WIDTH = "400px";

export default function Home() {
  return (
    <div>
      <Sheet
        component="aside"
        variant="soft"
        sx={{
          p: 3,
          position: "fixed",
          inset: "0 auto 0 0",
          width: SIDEBAR_WIDTH,
        }}
      >
        <Sidebar />
      </Sheet>
      <main style={{ marginLeft: SIDEBAR_WIDTH }}>
        <Container maxWidth={false} sx={{ my: 3 }}>
          <Typography level="h2" mb={2}>
            Results
          </Typography>
          <ResultTree />
        </Container>
      </main>
    </div>
  );
}
