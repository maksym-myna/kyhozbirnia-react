import React, { useContext, useEffect, useState } from "react";
import "./BigQueryExport.css";
import { serverURL } from "../../config";
import axios from "axios";
import { Checkbox, FormControlLabel, Select, MenuItem, TextField, Grid } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import Button from "../Button";
import { saveAs } from 'file-saver';
import { defaultSnackBar, Severity, SnackBarContext } from "../../contexts/SnackBarContext";


type TableData = {
    [tableName: string]: string[];
}

type FactData = {
    [factName: string]: TableData;
}

type SelectedFields = {
    [factName: string]: {
        [tableName: string]: string;
    };
}

export const BigQueryExport = () => {
    const [factData, setFactData] = useState<FactData>({});
    const [selectedFact, setSelectedFact] = useState<string>("");
    const [selectedFields, setSelectedFields] = useState<SelectedFields>({});
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [limit, setLimit] = useState<string>("");
    const { setSnackBar } = useContext(SnackBarContext);

    useEffect(() => {
        const fetchFields = async () => {
            const response = await axios.get(`${serverURL}/bigquery/`, { withCredentials: true });
            const data: FactData = response.data;
            setFactData(data);
            setSelectedFact(Object.keys(data)[0]); // Select the first fact by default
        }

        fetchFields();
    }, []);

    const handleFactChange = (event: SelectChangeEvent<string>) => {
        setSelectedFact(event.target.value as string);
    };

    const handleCheckboxChange = (fact: string, tableName: string, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFields(prev => ({
            ...prev,
            [fact]: {
                ...(prev[fact] || {}),
                [tableName]: event.target.checked ? field : ""
            }
        }));
    };

    const openSnack = (severity: Severity, message: string) => {
        setSnackBar({ ...defaultSnackBar, open: true, severity: severity, message: message });
    }

    const handleDownload = async () => {
        const selectedFactFields = selectedFields[selectedFact] || {};
        const fields = Object.values(selectedFactFields).filter(Boolean);

        // Check if at least one _fact field is selected
        const factFieldSelected = Object.keys(selectedFactFields).some(field => field.endsWith('_fact') && selectedFactFields[field]);

        if (!factFieldSelected) {
            openSnack('error', 'Оберіть метрику факта.');
            return;
        }

        const params = new URLSearchParams({
            fields: fields.join(','),
            limit: limit.toString(),
            startDate: startDate,
            endDate: endDate,
        });

        const url = `${serverURL}/bigquery/${selectedFact}/download/?${params.toString()}`;

        const response = await axios.get(url, {
            withCredentials: true,
            responseType: 'blob', // Important for file downloads
        });

        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        saveAs(blob, `${selectedFact}_${Date.now().toFixed()}.csv`);
    }

    return (
        <div className="big-query-export">
            <section className="bq-top-section-container">
                <section className="bq-top-section">
                    <Select
                        sx={{ background: "white" }}
                        value={selectedFact}
                        onChange={handleFactChange}>
                        {Object.keys(factData).map((factName) => (
                            <MenuItem key={factName} value={factName}>{factName}</MenuItem>
                        ))}
                    </Select>

                    <TextField
                        label="Мінімальна дата"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ background: "white", height: "90%" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Максимальна дата"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ background: "white", height: "90%" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Кількість значень"
                        value={limit}
                        sx={{ background: "white", height: "90%" }}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(Number(value))) {
                                setLimit(value);
                            }
                        }}
                        type="number"
                    />

                    <Button outlined onClick={handleDownload}>
                        Експортувати
                    </Button>
                </section>
            </section>
            <Grid className="grid" container direction="row">
                {selectedFact && Object.entries(factData[selectedFact]).map(([tableName, fields]) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={tableName}>
                        <Grid container direction="column">
                            <Grid item>
                                <h3>{tableName}</h3>
                            </Grid>
                            {fields.map((field, index) => (
                                <Grid item key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedFields[selectedFact]?.[tableName] === field || false}
                                                onChange={handleCheckboxChange(selectedFact, tableName, field)}
                                            />
                                        }
                                        label={field}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default BigQueryExport;