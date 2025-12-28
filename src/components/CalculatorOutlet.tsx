import { Tab, Tabs, Box } from "@mui/material";
import React from "react";

function CalculatoryOutlet() {
    const [value, setValue] = React.useState<number>(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label="Item One" />
                <Tab label="Item Two"  />
            </Tabs>
        </Box>
    );
}
export default CalculatoryOutlet;
