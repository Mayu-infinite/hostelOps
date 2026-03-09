import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"

export const metadata = {
  title: "HostelOps",
  description: "Hostel Issue Management System",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}