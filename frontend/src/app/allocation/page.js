"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Box,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function AllocationDashboard() {
  const [data, setData] = useState({ students: [], courses: [] });
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      // Note: Make sure to change localhost to your Render URL when deploying!
      const res = await axios.get(
        "https://university-ai-enrollment-platform.onrender.com/api/allocation/dashboard",
      );
      setData(res.data);
    } catch (err) {
      setError("Failed to fetch dashboard data from server.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Run Allocation
  const triggerAllocation = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "https://university-ai-enrollment-platform.onrender.com/api/allocation/process",
      );
      await fetchDashboardData();
      alert("Allocation Algorithm Executed Successfully!");
    } catch (err) {
      setError("Failed to run allocation algorithm.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Allocation
  const triggerReset = async () => {
    if (!window.confirm("Are you sure you want to clear all allocated seats?"))
      return;

    setLoading(true);
    setError("");
    try {
      await axios.post(
        "https://university-ai-enrollment-platform.onrender.com/api/reset",
      );
      await fetchDashboardData();
      alert("All allocations have been reset successfully!");
    } catch (err) {
      setError("Failed to reset allocations.");
    } finally {
      setLoading(false);
    }
  };

  // Mistral AI Chat
  const submitAIQuery = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "https://university-ai-enrollment-platform.onrender.com/api/allocation/ai-query",
        { question: query },
      );
      setAiResponse(res.data.answer);
    } catch (err) {
      setError("AI Query failed. Check your Mistral API Key.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Chart Calculations
  const totalStudents = data.students.length;
  const allocatedStudents = data.students.filter(
    (s) => s.allocatedCourse,
  ).length;
  const unallocatedStudents = totalStudents - allocatedStudents;

  const pieChartData = {
    labels: ["Allocated", "Unallocated"],
    datasets: [
      {
        data: [allocatedStudents, unallocatedStudents],
        backgroundColor: ["rgba(76, 175, 80, 0.8)", "rgba(244, 67, 54, 0.8)"], // Material UI Success & Error colors
        borderColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ mb: 5, mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Course Allocation Engine
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={triggerAllocation}
          disabled={loading}
          sx={{ py: 1.5, px: 4, fontWeight: "bold" }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Run Allocation Algorithm"
          )}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={triggerReset}
          disabled={loading || totalStudents === 0}
          sx={{ py: 1.5, px: 4, fontWeight: "bold" }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Reset All Allocations"
          )}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Top Row: Chart & Metrics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Allocation Overview
              </Typography>
              <Box
                sx={{
                  height: 250,
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Pie
                  data={pieChartData}
                  options={{ maintainAspectRatio: false }}
                />
              </Box>
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {totalStudents}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="success.main">
                    Allocated
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {allocatedStudents}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="error.main">
                    Unallocated
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {unallocatedStudents}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Row: AI Insights Terminal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mistral AI Insights
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ask the AI about the allocation results (e.g., "Which course had
                the most unallocated students?", "Show category-wise summary").
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Ask a question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={submitAIQuery}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Ask AI"}
              </Button>

              {aiResponse && (
                <Paper
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "background.default",
                    border: "1px solid #333",
                  }}
                >
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    AI Response:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {aiResponse}
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Bottom Row: Tables */}
        <Grid item xs={12}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Capacity & Utilization
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Name</TableCell>
                      <TableCell>Total Seats</TableCell>
                      <TableCell>Filled (Gen / OBC / SC / ST)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.courses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {course.name}
                        </TableCell>
                        <TableCell>{course.totalSeats}</TableCell>
                        <TableCell>
                          {course.filledSeats?.General || 0} /{" "}
                          {course.filledSeats?.OBC || 0} /{" "}
                          {course.filledSeats?.SC || 0} /{" "}
                          {course.filledSeats?.ST || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Student Applicant Roster
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Marks</TableCell>
                      <TableCell>Assigned Course</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.students.map((student) => (
                      <TableRow key={student.studentId}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={student.category}
                            size="small"
                            color={
                              student.category === "General"
                                ? "default"
                                : "primary"
                            }
                          />
                        </TableCell>
                        <TableCell>{student.marks}</TableCell>
                        <TableCell>
                          {student.allocatedCourse ? (
                            <Chip
                              label={student.allocatedCourse}
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Chip
                              label="Unallocated"
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
