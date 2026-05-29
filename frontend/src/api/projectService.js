import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProjects = async ({
  page = 1,
  limit = 50,
  search = "",
  status = "",
  sortBy = "projectName",
  order = "asc",
}) => {

  const response = await axios.get(API_URL, {
    params: {
      page,
      limit,
      search,
      status,
      sortBy,
      order,
    },
  });

  return response.data;
};