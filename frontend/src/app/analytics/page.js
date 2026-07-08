"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function AnalyticsDashboard() {
  const [file, setFile] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ upload: false, query: false });

  // Fetch query history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "https://university-ai-enrollment-platform.onrender.com/api/analytics/history",
      );
      setHistory(res.data.history);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file before uploading.");
      return;
    }

    setError("");
    setLoading({ ...loading, upload: true });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://university-ai-enrollment-platform.onrender.com/api/analytics/upload",
        formData,
      );
      setCollectionName(res.data.collectionName);
      alert("Dataset uploaded and mapped to database successfully!");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "An error occurred during upload.",
      );
    } finally {
      setLoading({ ...loading, upload: false });
    }
  };

  const handleQuery = async () => {
    if (!query) return;
    setError("");
    setLoading({ ...loading, query: true });

    try {
      const res = await axios.post(
        "https://university-ai-enrollment-platform.onrender.com/api/analytics/query",
        { collectionName, prompt: query },
      );
      setResults(res.data.results);
      // Refresh history log after successful query
      await fetchHistory();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "An error occurred during querying.",
      );
    } finally {
      setLoading({ ...loading, query: false });
    }
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      autoTable(doc, { html: "#results-table" });
      doc.save("results.pdf");
    } catch (err) {
      setError("Failed to generate PDF report: " + err.message);
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "results.xlsx");
  };

  // Helper function to extract a valid number from the row for the chart
  const extractNumericValue = (row) => {
    const validKeys = Object.keys(row).filter(
      (k) => k !== "_id" && k !== "__v",
    );
    for (let key of validKeys) {
      const val = row[key];
      if (val !== null && val !== "" && !isNaN(Number(val))) {
        return Number(val);
      }
    }
    return 0;
  };

  const chartData = {
    labels: results.map((_, i) => `Row ${i + 1}`),
    datasets: [
      {
        label: "Dataset Visualization (Numeric)",
        data: results.map((row) => extractNumericValue(row)),
        backgroundColor: "rgba(144, 202, 249, 0.5)",
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        AI Dataset Assistant
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column: Upload & Query Controls */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              1. Upload Dataset
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading.upload}
              >
                {loading.upload ? (
                  <CircularProgress size={24} />
                ) : (
                  "Upload & Map Data"
                )}
              </Button>
            </Box>
          </Paper>

          {collectionName && (
            <Paper sx={{ p: 3, mb: 3, border: "1px solid #90caf9" }}>
              <Typography variant="h6" gutterBottom>
                2. Query Assistant
              </Typography>
              <TextField
                fullWidth
                label="Ask something in English (e.g. 'Show top 10 rows', 'Find missing values')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading.query}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleQuery}
                disabled={loading.query}
                sx={{ mt: 2, px: 4 }}
              >
                {loading.query ? (
                  <CircularProgress size={24} />
                ) : (
                  "Run AI Query"
                )}
              </Button>
            </Paper>
          )}

          {/* Results Area */}
          {results.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Query Results</Typography>
                <Box>
                  <Button onClick={exportPDF} sx={{ mr: 2 }} variant="outlined">
                    Export PDF
                  </Button>
                  <Button
                    onClick={exportExcel}
                    variant="outlined"
                    color="secondary"
                  >
                    Export Excel
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Table id="results-table" size="small">
                <TableHead>
                  <TableRow>
                    {Object.keys(results[0])
                      .filter((k) => k !== "__v")
                      .map((k) => (
                        <TableCell key={k} sx={{ fontWeight: "bold" }}>
                          {k}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((row, i) => (
                    <TableRow key={i}>
                      {Object.entries(row)
                        .filter(([k]) => k !== "__v")
                        .map(([_, v], j) => (
                          <TableCell key={j}>{String(v)}</TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box sx={{ mt: 4, height: 300 }}>
                <Bar
                  data={chartData}
                  options={{ maintainAspectRatio: false }}
                />
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Right Column: Query History Log */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Query History Log
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              A record of your recent natural language requests and the
              AI-generated execution code.
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {history.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No queries executed yet.
              </Typography>
            ) : (
              <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
                {history.map((log) => (
                  <Box
                    key={log._id}
                    sx={{
                      mb: 3,
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ mb: 1, fontWeight: "bold" }}
                    >
                      "{log.naturalLanguageQuery}"
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: "#000",
                        p: 1,
                        borderRadius: 1,
                        overflowX: "auto",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "monospace",
                          color: "#4caf50",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {log.generatedQuery}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {new Date(log.createdAt).toLocaleString()} |{" "}
                      {log.datasetName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
