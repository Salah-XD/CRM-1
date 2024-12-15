import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import AuditResponse from "../models/AuditResponse.js";
import AuditManagement from "../models/auditMangement.js";
import Label from "../models/labelModel.js";
import Question from "../models/questionSchema.js";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const generateAuditReport = async (req, res) => {
  try {
    const { audit_id } = req.params;

    if (!audit_id) {
      return res.status(400).json({ message: "Audit ID is required" });
    }

    // Fetch necessary data
    const userDetail = await AuditManagement.findById(audit_id)
      .populate("user", "userName")
      .exec();
    if (!userDetail) {
      return res.status(404).json({ message: "Audit not found" });
    }

    const labels = await Label.find();
    const questions = await Question.find();
    const auditResponses = await AuditResponse.find({ audit: audit_id });

    const sections = labels.map((label) => {
      const labelQuestions = questions.filter(
        (question) => String(question.label) === String(label._id)
      );

      const questionsWithAnswers = labelQuestions.map((question, index) => {
        const auditResponse = auditResponses.find(
          (response) => String(response.question) === String(question._id)
        );

        return {
          questionId: question._id,
          description: ` ${question.question_text}`,
          mark: question.marks,
          comment: auditResponse?.comment || "No Observation",
          marks: auditResponse?.marks || "N/A",
        };
      });

      return {
        title: label.name,
        questions: questionsWithAnswers,
      };
    });

    // Read the HTML template from the file
    const templatePath = path.join(__dirname, "../templates/auditReport.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // Dynamically generate rows for the audit questions
    const sectionsHTML = sections
      .map((section) => {
        const questionsHTML = section.questions
          .map(
            (q, index) => `<!-- Dynamically Generated Row -->
          <tr>
            <td class="border px-4 py-2">${index + 1}</td> <!-- Dynamic S.No -->
            <td class="border px-4 py-2">${q.description}</td>
            <td class="border px-4 py-2">${q.comment}</td>
            <td class="border px-4 py-2 text-center">${q.mark}</td> <!-- Display Marks -->
            <td class="border px-4 py-2 text-center">${q.marks}</td> <!-- Actual Score -->
          </tr>`
          )
          .join("");

        return `<!-- Section: ${section.title} -->
          <h2 class="text-xl font-semibold mb-4">${section.title}</h2>
          <table class="w-full text-sm border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="border px-4 py-2 text-left">S.No</th>
                <th class="border px-4 py-2 text-left">Audit Question</th>
                <th class="border px-4 py-2 text-left">Observations</th>
                <th class="border px-4 py-2 text-center">Marks</th>
                <th class="border px-4 py-2 text-center">Actual Score</th>
              </tr>
            </thead>
            <tbody>
              ${questionsHTML}
            </tbody>
          </table>`;
      })
      .join("");

    // Insert the dynamically generated content into the HTML template
    htmlTemplate = htmlTemplate.replace("{{AUDIT_SECTIONS}}", sectionsHTML);

    // Launch Puppeteer to generate the PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: "load" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Send the generated PDF to the client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=audit-report.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating audit report:", error);
    res.status(500).json({ message: "An error occurred while generating the audit report" });
  }
};
