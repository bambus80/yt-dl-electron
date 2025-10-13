import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import DownloadPage from "./components/DownloadPage/index.jsx";
import LibraryPage from "./components/LibraryPage/index.jsx";

const App = () => {
    return <Tabs>
        <TabList>
            <Tab>Download</Tab>
            <Tab>Library</Tab>
        </TabList>

        <TabPanel>
            <DownloadPage />
        </TabPanel>
        <TabPanel>
            <LibraryPage />
        </TabPanel>
    </Tabs>
}

export default App;