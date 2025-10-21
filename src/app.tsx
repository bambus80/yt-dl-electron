import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./index.css";

import DownloadPage from "./components/DownloadPage/index";
import LibraryPage from "./components/LibraryPage/index";
import { createRoot } from "react-dom/client";

const App: React.FC = () => {
  return (
    <Tabs>
      <TabList>
        <div className="primary-tabs">
          <Tab>Download</Tab>
          <Tab>Library</Tab>
        </div>
      </TabList>

      <TabPanel>
        <DownloadPage />
      </TabPanel>
      <TabPanel>
        <LibraryPage />
      </TabPanel>
    </Tabs>
  );
};

const container = document.getElementById("root");
if (!container) throw new Error("No root element");

const root = createRoot(container);
root.render(<App />);
