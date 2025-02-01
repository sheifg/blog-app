import React from "react";
import Header from "./Header";

// Creating the layout, you it can be reused for different pages, wrapping the codes of this pages with Layout, as it is done in this project
// Another way to do it, it is wrapping layout in the appRoutes, example in commented lines
export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto mt-5">{children}</main>
      <footer className="ring-1 ring-gray-300 bg-gray-100 p-5 mt-5">
        <p className="text-center text-gray-700"> Copy Rights &copy; 2024</p>
      </footer>
    </div>
  );
}
