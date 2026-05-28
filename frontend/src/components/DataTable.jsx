import { useEffect } from "react";

import {
  DataGrid,
  useGridApiRef,
} from "@mui/x-data-grid";

const columns = [
  {
    field: "_id",
    headerName: "ID",
    width: 220,
  },

  {
    field: "projectName",
    headerName: "Project Name",
    flex: 1,
    minWidth: 180,
  },

  {
    field: "latitude",
    headerName: "Latitude",
    width: 130,
  },

  {
    field: "longitude",
    headerName: "Longitude",
    width: 130,
  },

  {
    field: "status",
    headerName: "Status",
    width: 130,
  },

  {
    field: "lastUpdated",
    headerName: "Last Updated",
    width: 180,

    valueFormatter: (value) =>
      new Date(value)
        .toLocaleDateString(),
  },
];

export default function DataTable({

  rows,

  totalRows,

  page,

  pageSize,

  onPageChange,

  selectedId,

  onSelect,

  loading,

}) {

  const apiRef = useGridApiRef();

  // AUTO SCROLL SELECTED ROW
  useEffect(() => {

    if (
      !selectedId ||
      !apiRef.current
    ) return;

    const rowIndex =
      rows.findIndex(
        (row) =>
          row._id === selectedId
      );

    if (rowIndex === -1) return;

    setTimeout(() => {

      apiRef.current
        .scrollToIndexes({
          rowIndex,
        });

      apiRef.current
        .setCellFocus(
          selectedId,
          "projectName"
        );

    }, 100);

  }, [selectedId, rows]);

  return (

    <DataGrid

      apiRef={apiRef}

      rows={rows}

      columns={columns}

      loading={loading}

      getRowId={(row) => row._id}

      // SERVER PAGINATION
      paginationMode="server"

      rowCount={totalRows}

      paginationModel={{
        page,
        pageSize,
      }}

      pageSizeOptions={[
        pageSize,
      ]}

      onPaginationModelChange={(
        model
      ) =>
        onPageChange(
          model.page
        )
      }

      onRowClick={(params) =>
        onSelect(params.id)
      }

      getRowClassName={(params) =>
        params.id === selectedId
          ? "selected-row"
          : ""
      }

      // PERFORMANCE
      rowBufferPx={300}

      columnBufferPx={150}

      disableRowSelectionOnClick

      disableColumnMenu

      disableDensitySelector

      disableColumnFilter

      sx={{

        "& .selected-row": {

          backgroundColor:
            "#ffe5e5 !important",

          borderLeft:
            "5px solid #d32f2f",
        },
      }}
    />
  );
}