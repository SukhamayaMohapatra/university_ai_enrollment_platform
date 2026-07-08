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
} from "@mui/material";

export default function AllocationDashboard() {
  const [data, setData] = useState({ students: [], courses: [] });
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
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

  return (
    <Container maxWidth="xl" sx={{ mb: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Course Allocation Engine
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="secondary"
        onClick={triggerAllocation}
        disabled={loading}
        sx={{ mb: 4, py: 1.5, px: 4, fontWeight: "bold" }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Run Allocation Algorithm"
        )}
      </Button>

      <Grid container spacing={4}>
        {/* Left Column: Tables */}
        <Grid item xs={12} md={8}>
          {/* Courses Table */}
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
                        <TableCell>{course.name}</TableCell>
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

          {/* Students Table (Scrollable for 100+ records) */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Student Applicant Roster ({data.students.length})
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
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

        {/* Right Column: Mistral AI Chat */}
        <Grid item xs={12} md={4}>
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
                rows={3}
                label="Ask a question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={submitAIQuery}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Ask AI"}
              </Button>

              {aiResponse && (
                <Paper
                  sx={{
                    mt: 4,
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
      </Grid>
    </Container>
  );
}
