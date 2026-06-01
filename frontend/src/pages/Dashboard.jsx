import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import DataTable from "../components/DataTable";

import MapView from "../components/MapView";

import { useGeoData } from "../hooks/useGeoData";

export default function Dashboard() {
  const {
    data,

    selectedId,
    setSelectedId,

    page,
    setPage,

    totalRows,

    loading,

    hasMore,

    // Search
    search,
    setSearch,

    // Filter
    status,
    setStatus,

    // Sorting
    sortBy,
    setSortBy,

    order,
    setOrder,
  } = useGeoData();

  // LOAD NEXT PAGE
  const loadMore = () => {
    if (loading || !hasMore) return;

    setPage((prev) => prev + 1);
  };

  if (loading && data.length === 0) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h2>Loading Geo Dashboard...</h2>

      <p>
        Backend may be waking up from inactivity.
      </p>

      <p>
        First load can take up to 30-60 seconds.
      </p>
    </div>
  );
}

  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns: "800px 1fr",

        gap: 16,

        height: "100vh",

        overflow: "hidden",

        padding: "16px",

        boxSizing: "border-box",
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          display: "flex",

          flexDirection: "column",

          gap: 16,

          overflow: "hidden",
        }}
      >
        {/* CONTROLS */}
        <div
          style={{
            display: "flex",

            gap: 12,

            flexWrap: "wrap",
          }}
        >
          {/* SEARCH */}
          <TextField
            label="Search Project"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          {/* STATUS FILTER */}
          <FormControl
            size="small"
            style={{
              minWidth: 140,
            }}
          >
            <InputLabel>Status</InputLabel>

            <Select
              value={status}
              label="Status"
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>

              <MenuItem value="Active">Active</MenuItem>

              <MenuItem value="Inactive">Inactive</MenuItem>

              <MenuItem value="Pending">Pending</MenuItem>

              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          {/* SORT FIELD */}
          <FormControl
            size="small"
            style={{
              minWidth: 150,
            }}
          >
            <InputLabel>Sort By</InputLabel>

            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="createdAt">Created At</MenuItem>

              <MenuItem value="projectName">Project Name</MenuItem>

              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>

          {/* SORT ORDER */}
          <FormControl
            size="small"
            style={{
              minWidth: 140,
            }}
          >
            <InputLabel>Order</InputLabel>

            <Select
              value={order}
              label="Order"
              onChange={(e) => setOrder(e.target.value)}
            >
              <MenuItem value="asc">Ascending</MenuItem>

              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* TABLE */}
        <div
          style={{
            flex: 1,

            overflow: "hidden",
          }}
        >
          <DataTable
            rows={data}
            totalRows={totalRows}
            page={page - 1}
            pageSize={50}
            onPageChange={(newPage) => setPage(newPage + 1)}
            selectedId={selectedId}
            onSelect={setSelectedId}
            loading={loading}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          height: "100%",

          position: "sticky",

          top: 0,
        }}
      >
        <MapView data={data} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
