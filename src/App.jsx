import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { projects } from "./projects";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";

const App = () => {
  const initialDataState = {
    take: 10,
    skip: 0,
    filter: undefined,
    sort: undefined,
  };

  const [dataState, setDataState] = useState(initialDataState);
  const [data, setData] = useState(projects); //eslint-disable-line
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const [Owners, setOwners] = useState([]);

  useEffect(() => {
    const uniqueOwners = [...new Set(projects.map((p) => p.Owner))];
    setOwners(uniqueOwners);
  }, [data]);

  const handleStartDateChange = (e) => {
    setStartDate(e.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.value);
  };

  const filterData = () => {
    let filteredProjects = [...projects];

    if (startDate && endDate) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          new Date(project.CreatedDate) >= startDate &&
          new Date(project.endDate) <= endDate
      );
    }

    if (selectedOwner) {
      filteredProjects = filteredProjects.filter(
        (project) => project.Owner === selectedOwner
      );
    }

    return filteredProjects;
  };

  const handleDataStateChange = (event) => {
    setDataState(event.dataState);
  };

  const _export = React.useRef(null);

  const exportExport = () => {
    if (_export.current !== null) {
      _export.current.save(filterData());
    }
  };

  const filteredData = filterData();

  return (
    <ExcelExport ref={_export}>
      <Grid
        data={process(filteredData, dataState)}
        pageable={true}
        skip={dataState.skip}
        take={dataState.take}
        total={filteredData.length}
        filterable={true}
        onDataStateChange={handleDataStateChange}
      >
        <GridToolbar>
          <Button
            title="Export Excel"
            themeColor={"primary"}
            type="button"
            onClick={exportExport}
          >
            Export to Excel
          </Button>
        </GridToolbar>
        <Column field="ProjectID" title="ID" />
        <Column field="ProjectName" title="Project Name" />
        <Column
          field="Owner"
          headerCell={() => (
            <DropDownList
              label="Owner"
              defaultItem="Select a owner"
              data={Owners}
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.value)}
              style={{ width: "150px", marginTop: "5px" }}
            />
          )}
        />
        <Column
          field="CreatedDate"
          title="Created Date"
          format="{0:MM-dd-yyyy}"
          headerCell={() => (
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              label="Start Date"
            />
          )}
        />
        <Column
          field="EndDate"
          title="End Date"
          format="{0:MM-dd-yyyy}"
          headerCell={() => (
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              label="End Date"
            />
          )}
        />
      </Grid>
    </ExcelExport>
  );
};

export default App;
