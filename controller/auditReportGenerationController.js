import AuditResponse from "../models/AuditResponse.js";
import AuditManagement from "../models/auditMangement.js";
import Label from "../models/labelModel.js";
import Question from "../models/questionSchema.js";

export const generateAuditReport = async (req, res) => {
  try {
    const { audit_id } = req.params;

    if (!audit_id) {
      return res.status(400).json({ message: "Audit ID is required" });
    }

    // Fetch the Auditor Name from AuditManagement
    const userDetail = await AuditManagement.findById(audit_id)
      .select("user")
      .populate("user", "userName")
      .exec();

    if (!userDetail) {
      return res.status(404).json({ message: "Audit not found" });
    }

    // Fetch all labels
    const labels = await Label.find();

    // Fetch all questions in one go
    const questions = await Question.find();

    // Fetch all responses related to the audit in one go
    const auditResponses = await AuditResponse.find({ audit: audit_id });

    const data = labels.map((label) => {
      const labelQuestions = questions.filter(
        (question) => String(question.label) === String(label._id)
      );

      const questionsWithAnswers = labelQuestions.map((question, index) => {
        const auditResponse = auditResponses.find(
          (response) => String(response.question) === String(question._id)
        );

        return {
          questionId: question._id,
          description: `${index + 1}. ${question.question_text}`,
          mark: question.marks,
          comment: auditResponse?.comment || "", // Populate comment if it exists
          marks: auditResponse?.marks || "", // Populate marks if it exists
          image_url: auditResponse?.image_url || "", // Populate image URL if it exists
        };
      });

      return {
        title: label.name, // Use label name as the title
        questions: questionsWithAnswers,
      };
    });

    res.status(200).json({
      auditor: userDetail.user?.userName || "Unknown",
      data,
      message: "Audit Report Generated Successfully",
    });
  } catch (error) {
    console.error("Error generating audit report:", error);
    res.status(500).json({ message: "An error occurred while generating the audit report" });
  }
};
