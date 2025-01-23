import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { projects } from "./projects";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import Xlsave from "./components/Xlsave";
import DateSelector from "./components/DateSelector";

const App = () => {
  const initialDataState = {
    take: 10,
    skip: 0,
    filter: undefined,
    sort: undefined,
  };

  const [dataState, setDataState] = useState(initialDataState);
  const [data, setData] = useState(projects); //eslint-disable-line
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [exportName, setExportName] = useState(null);
    const [dateRange, setDateRange] = useState({
      start: null,
      end: null,
    });
  const [Owners, setOwners] = useState([]);

  useEffect(() => {
    const uniqueOwners = [...new Set(projects.map((p) => p.Owner))];
    setOwners(uniqueOwners);
  }, [data]);

  const filterData = () => {
    let filteredProjects = [...projects];

    if (dateRange.start && dateRange.end) {
      filteredProjects = filteredProjects.filter(
        (project) =>
          new Date(project.CreatedDate) >= dateRange.start &&
          new Date(project.EndDate) <= dateRange.end
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

    const handleDateRangeChange = (range) => {
      setDateRange(range);
    };
  const _export = React.useRef(null);

  const exportExport = (name) => {
    if (!name) {
      alert("Please enter a file name");
      return;
    }
    setExportName(name);
    if (_export.current !== null) {
      _export.current.save(filterData());
    }
  };

  const filteredData = filterData();

  return (
    <ExcelExport ref={_export} fileName={exportName}>
      <Grid
        data={process(filteredData, dataState)}
        pageable={true}
        skip={dataState.skip}
        take={dataState.take}
        total={filteredData.length}
        // filterable={true}
        onDataStateChange={handleDataStateChange}
      >
        <GridToolbar>
          <Xlsave exportExport={exportExport} />
          <DateSelector onDateRangeChange={handleDateRangeChange} />
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
          title="Created Date (MM-dd-yyyy)"
          format="{0:mm-dd-yyyy}"
        />
        <Column
          field="EndDate"
          title="End Date (MM-dd-yyyy)"
          format="{0:mm-dd-yyyy}"
        />
      </Grid>
    </ExcelExport>
  );
};

export default App;
