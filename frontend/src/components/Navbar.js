"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          University AI Platform
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/" passHref>
            <Button sx={{ color: "#fff" }}>Home</Button>
          </Link>
          <Link href="/allocation" passHref>
            <Button sx={{ color: "#fff" }}>Course Allocation</Button>
          </Link>
          <Link href="/analytics" passHref>
            <Button sx={{ color: "#fff" }}>SQL Assistant</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
