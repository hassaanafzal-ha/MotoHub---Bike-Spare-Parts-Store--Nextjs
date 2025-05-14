// Import necessary components from Next.js document
import { Html, Head, Main, NextScript } from "next/document";

// Define the Document component
export default function Document() {
  // Return the JSX for the document
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
