import Project from "../models/Project.js";

export const getProjects = async (req, res) => {
  try {
    // Pagination
    const page = Number(req.query.page) || 1;

    const limit = Math.min(Number(req.query.limit) || 50, 100);

    const skip = (page - 1) * limit;

    // Search + Filters
    const search = req.query.search || "";
    const status = req.query.status || "";

    // Sorting
    const sortBy = req.query.sortBy || "projectName";
    let sortField = sortBy;

    // Fix numeric sorting for project names
    if (sortBy === "projectName") {
      sortField = "projectNumber";
    }
    const order = req.query.order === "asc" ? 1 : -1;

    // Dynamic Query Object
    const query = {};

    // Search by project name
    if (search) {
      query.projectName = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Total count AFTER filters
    const total = await Project.countDocuments(query);

    // Fetch paginated data
    const projects = await Project.find(query)
      .sort({ [sortField]: order })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};