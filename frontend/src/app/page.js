import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          University AI Platform
        </Typography>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
          <Link href="/allocation" passHref>
            <Button variant="contained">Task 1: Course Allocation</Button>
          </Link>
          <Link href="/analytics" passHref>
            <Button variant="contained" color="secondary">
              Task 2: AI SQL Assistant
            </Button>
          </Link>
        </Box>
      </Container>
    </>
  );
}
