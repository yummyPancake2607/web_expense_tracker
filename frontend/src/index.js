import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPublishableKey = "pk_test_Z2xvcmlvdXMtY2ljYWRhLTkxLmNsZXJrLmFjY291bnRzLmRldiQ"; // <-- Your actual pk_test key

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <App />
  </ClerkProvider>
);