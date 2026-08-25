import { MongoServerClosedError } from "mongodb";
import mongoose, { STATES } from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        projectName : {
            type : String,
            required : true,
        },
        projectNumber : {
            type : Number,
            required : true,
        },
        latitude : {
            type : Number,
            required : true,
        },
        longitude: {
                type : Number,
                required : true
        },
        status : {
            type : String,
            enum : ["Active", "Inactive", "Pending", "Completed"],
            required: true
        },
        lastUpdated : {
            type : Date,
            required : true
        }
    },
    {
    timestamps: true,
    }
);

projectSchema.index({ projectName: 1 });
projectSchema.index({ projectNumber: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ createdAt: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;