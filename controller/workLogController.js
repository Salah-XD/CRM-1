import WorkLog from "../models/workLogModel.js";
import moment from "moment";
import mongoose from "mongoose";

// Create Work Log
export const createWorkLog = async (req, res) => {
  console.log(req.body);
  try {
    const {
      userId,
      workType,
      startTime,
      endTime,
      description,
      reason,
      paidLeave,
      sickLeave,
    } = req.body;

    // Validate required fields
    if (!userId || !workType) {
      return res.status(400).json({
        message: "userId, workType, startTime, and endTime are required",
      });
    }

    // Get today's date (ignoring time)
    const todayStart = moment().startOf("day"); // This will get the start of today (00:00)
    const todayEnd = moment().endOf("day"); // This will get the end of today (23:59)

    // Check if a work log entry already exists for the user today
    const existingWorkLog = await WorkLog.findOne({
      userId,
      createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() }, // Check within today's date range
    });

    if (existingWorkLog) {
      return res
        .status(401)
        .json({ message: "Work log entry already exists for today" });
    }

    // Create a new work log entry
    const workLog = new WorkLog({
      userId,
      workType,
      startTime,
      endTime,
      description,
      reason,
      paidLeave,
      sickLeave,
    });

    await workLog.save();
    res.status(201).json({ message: "Work log created successfully", workLog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating work log", error: error.message });
  }
};

// Update Work Log
export const updateWorkLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { role } = req.user || {}; // Ensure req.user is defined before accessing role

    if (role === "AUDITOR") {
      const todayStart = moment().startOf("day");
      const todayEnd = moment().endOf("day");

      if (!moment(workLog.createdAt).isBetween(todayStart, todayEnd)) {
        return res.status(403).json({
          message:
            "Forbidden: Auditors can only update work logs created today",
        });
      }
    }

    const workLog = await WorkLog.findById(id);
    if (!workLog) {
      return res.status(404).json({ message: "Work log not found" });
    }

    const currentWorkType = workLog.workType;

    if (currentWorkType === "absent" && updateData.workType !== "absent") {
      console.log("Resetting absent fields");
      // Reset reason, paidLeave, and sickLeave if workType changes from "Absent"
      updateData.reason = null;
      updateData.paidLeave = false;
      updateData.sickLeave = false;
    } else if(currentWorkType !=="absent" && updateData.workType === "absent") {
  
      // Reset startTime, endTime, and description if workType remains "Absent"
      updateData.startTime = null;
      updateData.endTime = null;
      updateData.description = null;
    }

    const updatedWorkLog = await WorkLog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // Ensures validation rules are applied
    });

    res
      .status(200)
      .json({ message: "Work log updated successfully", updatedWorkLog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating work log", error: error.message });
  }
};

// Delete Work Log
export const deleteWorkLogs = async (req, res) => {
  try {
    const arrayOfWorkLogIds = req.body;

    // Validate arrayOfWorkLogIds if necessary
    if (!Array.isArray(arrayOfWorkLogIds)) {
      return res
        .status(400)
        .json({ error: "Invalid input: Expected an array of WorkLog IDs" });
    }

    // Perform deletions
    const deletionPromises = arrayOfWorkLogIds.map(async (workLogId) => {
      // Delete WorkLog document
      await WorkLog.deleteOne({ _id: workLogId });
    });

    // Wait for all deletion operations to complete
    await Promise.all(deletionPromises);

    res.status(200).json({ message: "WorkLogs deleted successfully" });
  } catch (err) {
    console.error("Error deleting work logs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllWorkLogsByUser = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sort, keyword, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const pageNumber = parseInt(page, 10);
    const sizePerPage = parseInt(pageSize, 10);

    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(sizePerPage) ||
      sizePerPage < 1
    ) {
      return res
        .status(400)
        .json({ message: "Invalid page or pageSize parameter" });
    }

    let query = { userId };
    if (keyword) {
      query = {
        ...query,
        $or: [
          { workType: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    let sortQuery = {};
    switch (sort) {
      case "alllist":
        sortQuery = { createdAt: 1 };
        break;
      case "newlyadded ":
        sortQuery = { createdAt: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    const workLogs = await WorkLog.find(query)
      .sort(sortQuery)
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .select("workType description startTime endTime createdAt");

    const totalWorkLogs = await WorkLog.countDocuments(query);

    res.status(200).json({
      data: workLogs.map((log) => ({
        ...log.toObject(),
        startTime: log.startTime
          ? moment(log.startTime).format("HH:mm A")
          : "N/A",
        endTime: log.endTime ? moment(log.endTime).format("HH:mm A") : "N/A",
        paidLeave: log.paidLeave,
        sickLeave: log.sickLeave,
        date: moment(log.createdAt).format("DD-MM-YYYY"), // Extracted date from createdAt
        dateAndTime: moment(log.createdAt).format("DD-MM-YYYY HH:mm A"), // Formatted timestamp
        totalHours: log.startTime
          ? moment
              .duration(moment(log.endTime).diff(moment(log.startTime)))
              .asHours()
              .toFixed(2)
              .toString() + " Hours"
          : "N/A",
      })),
      total: totalWorkLogs,
      page: pageNumber,
      pageSize: sizePerPage,
      totalPages: Math.ceil(totalWorkLogs / sizePerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to check if a work log already exists for today
export const isWorkLogAlreadyExist = async (req, res) => {
  try {
    const { userId } = req.query; // Get the userId from the query params

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Get today's date (ignoring time)
    const todayStart = moment().startOf("day"); // This will get the start of today (00:00)
    const todayEnd = moment().endOf("day"); // This will get the end of today (23:59)

    // Check if a work log entry already exists for the user today
    const existingWorkLog = await WorkLog.findOne({
      userId,
      createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() }, // Check within today's date range
    });

    if (existingWorkLog) {
      return res
        .status(401)
        .json({ message: "Work log entry already exists for today" });
    }
    // Check if a work log entry already exists for the user today

    res.status(200).json({ message: "No work log entry found for today" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking work log", error: error.message });
  }
};

export const getAllWorkLogs = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sort, userId } = req.query;

    const pageNumber = parseInt(page, 10);
    const sizePerPage = parseInt(pageSize, 10);

    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(sizePerPage) ||
      sizePerPage < 1
    ) {
      return res
        .status(400)
        .json({ message: "Invalid page or pageSize parameter" });
    }

    let query = {};

    // Validate and apply user filtering
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      query.userId = userId;
    }

    let sortQuery = { createdAt: 1 }; // Default sorting (oldest first)
    if (sort === "newlyadded") {
      sortQuery = { createdAt: -1 };
    }

    const workLogs = await WorkLog.find(query)
      .sort(sortQuery)
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .populate("userId", "userName")
      .select(
        "workType description startTime endTime createdAt userId paidLeave sickLeave"
      );

    const totalWorkLogs = await WorkLog.countDocuments(query);

    console.log(workLogs);

    res.status(200).json({
      data: workLogs.map((log) => ({
        ...log.toObject(),
        auditor_name: log.userId?.userName || "N/A",
        startTime: log.startTime
          ? moment(log.startTime).format("HH:mm A")
          : "N/A",
        endTime: log.endTime ? moment(log.endTime).format("HH:mm A") : "N/A",
        date: moment(log.createdAt).format("DD-MM-YYYY"),
        dateAndTime: moment(log.createdAt).format("DD-MM-YYYY HH:mm A"),
        paidLeave: log.paidLeave,
        sickLeave: log.sickLeave,
        totalHours:
          log.startTime && log.endTime
            ? moment
                .duration(moment(log.endTime).diff(moment(log.startTime)))
                .asHours()
                .toFixed(2) + " Hours"
            : "N/A",
      })),
      total: totalWorkLogs,
      page: pageNumber,
      pageSize: sizePerPage,
      totalPages: Math.ceil(totalWorkLogs / sizePerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWorkLogById = async (req, res) => {
  try {
    const { workLogId } = req.params; // Get work log ID from request params

    // Find work log by ID
    const workLog = await WorkLog.findById(workLogId);

    if (!workLog) {
      return res.status(404).json({ message: "Work log not found" });
    }

    // Format the work log data
    const formattedWorkLog = {
      ...workLog.toObject(),
      startTime: workLog.startTime,
      endTime: workLog.endTime,
      date: moment(workLog.createdAt).format("DD-MM-YYYY"), // Extracted date from createdAt
      dateAndTime: moment(workLog.createdAt).format("DD-MM-YYYY HH:mm A"), // Formatted timestamp
      totalHours: workLog.startTime
        ? moment
            .duration(moment(workLog.endTime).diff(moment(workLog.startTime)))
            .asHours()
            .toFixed(2) + " Hours"
        : "N/A",
    };

    res.status(200).json({ workLog: formattedWorkLog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching work log", error: error.message });
  }
};
