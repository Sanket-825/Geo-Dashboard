import axios from "axios";

const API_URL =
  "http://localhost:5000/api/projects";

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