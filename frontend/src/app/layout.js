import ThemeRegistry from "../theme/ThemeRegistry";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "University AI Platform",
  description: "AI-Powered Course Allocation and Data Analytics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#121212" }}>
        <ThemeRegistry>
          <Navbar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
