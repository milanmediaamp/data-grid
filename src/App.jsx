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
  const [data, setData] = useState(projects);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  const [projectNames, setProjectNames] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const uniqueProjectNames = [...new Set(projects.map((p) => p.ProjectName))];
    const uniqueTeamMembers = [...new Set(projects.map((p) => p.TeamMember))];

    setProjectNames(uniqueProjectNames);
    setTeamMembers(uniqueTeamMembers);
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
          new Date(project.CreatedDate) <= endDate
      );
    }

    if (selectedProjectName) {
      filteredProjects = filteredProjects.filter(
        (project) => project.ProjectName === selectedProjectName
      );
    }

    if (selectedTeamMember) {
      filteredProjects = filteredProjects.filter(
        (project) => project.TeamMember === selectedTeamMember
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
        data={{
          ...process(filteredData, dataState),
          data: process(filteredData, dataState).data,
        }}
        pageable={true}
        skip={dataState.skip}
        take={dataState.take}
        total={filteredData.length}
        filterable={true}
        filter={dataState.filter}
        sortable={true}
        sort={dataState.sort}
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
          <DatePicker
            value={startDate}
            onChange={handleStartDateChange}
            label="Start Date"
          />
          <DatePicker
            value={endDate}
            onChange={handleEndDateChange}
            label="End Date"
          />
          <DropDownList
            data={projectNames}
            value={selectedProjectName}
            onChange={(e) => setSelectedProjectName(e.value)}
            placeholder="Select Project"
            label="Project Name"
          />
          <DropDownList
            data={teamMembers}
            value={selectedTeamMember}
            onChange={(e) => setSelectedTeamMember(e.value)}
            placeholder="Select Team Member"
            label="Team Member"
          />
        </GridToolbar>
        <Column field="ProjectID" title="ID" />
        <Column field="ProjectName" title="Project Name" />
        <Column field="TeamMember" title="Owner" />
        <Column
          field="CreatedDate"
          title="Created Date"
          format="{0:yyyy-MM-dd}"
        />
        <Column field="EndDate" title="End Date" format="{0:yyyy-MM-dd}" />
      </Grid>
    </ExcelExport>
  );
};

export default App;
