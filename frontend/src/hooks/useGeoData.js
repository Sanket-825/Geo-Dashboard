import {
  useEffect,
  useState,
  useMemo,
} from "react";

import { fetchProjects }
  from "../api/projectService";

export const useGeoData = () => {

  const [data, setData] =
    useState([]);

  const [selectedId, setSelectedId] =
    useState(null);

  // PAGINATION
  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(50);

  const [totalRows, setTotalRows] =
    useState(0);

  // LOADING
  const [loading, setLoading] =
    useState(false);

  // SEARCH
  const [search, setSearch] =
    useState("");

  // DEBOUNCED SEARCH
  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  // STATUS FILTER
  const [status, setStatus] =
    useState("");

  // SORTING
  const [sortBy, setSortBy] =
    useState("projectName");

  const [order, setOrder] =
    useState("asc");

  // SEARCH DEBOUNCE
  useEffect(() => {

    const timer = setTimeout(() => {

      setDebouncedSearch(search);

    }, 500);

    return () =>
      clearTimeout(timer);

  }, [search]);

  // RESET TO PAGE 1
  // WHEN FILTERS CHANGE
  useEffect(() => {

    setPage(1);

  }, [
    debouncedSearch,
    status,
    sortBy,
    order,
  ]);

  // FETCH PROJECTS
  useEffect(() => {

    const loadProjects = async () => {

      try {

        setLoading(true);

        const response =
          await fetchProjects({
            page,
            limit,
            search: debouncedSearch,
            status,
            sortBy,
            order,
          });

        // REPLACE DATA
        // (NO APPENDING)
        setData(response.projects);

        setTotalRows(response.total);

      } catch (error) {

        console.error(
          "Error fetching projects:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    loadProjects();

  }, [
    page,
    limit,
    debouncedSearch,
    status,
    sortBy,
    order,
  ]);

  // SELECTED ITEM
  const selectedItem = useMemo(() => {

    return data.find(
      (item) =>
        item._id === selectedId
    );

  }, [data, selectedId]);

  return {

    data,

    selectedId,
    setSelectedId,

    selectedItem,

    page,
    setPage,

    limit,

    totalRows,

    loading,

    // SEARCH
    search,
    setSearch,

    // FILTER
    status,
    setStatus,

    // SORTING
    sortBy,
    setSortBy,

    order,
    setOrder,
  };
};