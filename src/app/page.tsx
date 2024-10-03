import ResultTree from "@/components/ResultTree";
import Sidebar from "@/components/Sidebar";
import { Container, Sheet } from "@mui/joy";

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
          <ResultTree />
        </Container>
      </main>
    </div>
  );
}
