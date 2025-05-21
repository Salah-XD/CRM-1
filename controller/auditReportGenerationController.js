import fs from "fs";
import path from "path";
import puppeteer from "puppeteer"; // Import Puppeteer
import AuditResponse1 from "../models/auditReponseModel.js";
import AuditManagement from "../models/auditMangement.js";
import Label from "../models/labelModel.js";
import Question from "../models/questionSchema.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateAuditReport = async (req, res) => {
  let browser;
  try {
    console.log(req.body);
    const { audit_id, checkListId } = req.body;

    if (!audit_id) {
      return res.status(400).json({ message: "Audit ID is required" });
    }

    // Fetch necessary data
    const auditDetails = await AuditManagement.findById(audit_id)
      .populate("user", "userName")
      .exec();
    if (!auditDetails) {
      return res.status(404).json({ message: "Audit not found" });
    }

    const labels = await Label.find({ checklistCategory: checkListId });
    const questions = await Question.find();
    const auditResponse1s = await AuditResponse1.find({ audit: audit_id });

    // Process sections and questions
    const sections = labels.map((label) => {
      const labelQuestions = questions.filter(
        (question) => String(question.label) === String(label._id)
      );

      const questionsWithAnswers = labelQuestions.map((question, index) => {
        const auditResponse1 = auditResponse1s.find(
          (response) => String(response.question) === String(question._id)
        );

        return {
          questionId: question._id,
          description: ` ${question.question_text}`,
          mark: question.marks,
          comment: auditResponse1?.comment || "No Observation",
          marks: auditResponse1?.marks || "N/A",
        };
      });

      return {
        title: label.name,
        questions: questionsWithAnswers,
      };
    });

    // Read the HTML template from file
    const templatePath = path.join(__dirname, "../templates/auditReport.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // Read and convert the logo image to Base64 synchronously
    const logoPath = path.join(__dirname, "../templates/logo2.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

    // Replace dynamic placeholders
    const { fbo_name, location, fssai_number, outlet_name } = auditDetails;

    htmlTemplate = htmlTemplate
      .replace(/{{fbo_name}}/g, fbo_name || "N/A")
      .replace(/{{location}}/g, location || "N/A")
      .replace(/{{fssai_number}}/g, fssai_number || "N/A")
      .replace(/{{auditor_name}}/g, auditDetails.user?.userName || "N/A")
      .replace(/{{imageData}}/g, logoBase64);

    // Generate dynamic sections HTML
    const sectionsHTML = sections
      .map((section) => {
        const questionsHTML = section.questions
          .map(
            (q, index) => `
        <tr class="text-xs">
          <td class="border px-2 py-1">${index + 1}</td>
          <td class="border px-2 py-1">${q.description}</td>
          <td class="border px-2 py-1">${q.comment}</td>
          <td class="border px-2 py-1 text-center">${q.mark}</td>
          <td class="border px-2 py-1 text-center">${q.marks}</td>
        </tr>`
          )
          .join("");

        return `
      <h2 class="text-sm font-semibold my-2">${section.title}</h2>
      <table class="w-full text-xs border border-gray-300">
        <thead>
          <tr>
            <th class="border px-2 py-1 text-left">S.No</th>
            <th class="border px-2 py-1 text-left">Audit Question</th>
            <th class="border px-2 py-1 text-left">Observations</th>
            <th class="border px-2 py-1 text-center">Marks</th>
            <th class="border px-2 py-1 text-center">Actual Score</th>
          </tr>
        </thead>
        <tbody>
          ${questionsHTML}
        </tbody>
      </table>`;
      })
      .join("");

    htmlTemplate = htmlTemplate.replace("{{AUDIT_SECTIONS}}", sectionsHTML);

    // Generate the PDF using Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: ``,
      footerTemplate: `
        <div style="width: 100%; font-size: 8px; text-align: center; padding: 4px 0;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
      margin: {
        top: "40px",
        bottom: "40px",
        right: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // Send the generated PDF to the client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=audit-report-${fbo_name}-${outlet_name}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating audit report:", error);
    console.error("Puppeteer error:", error.message);
    console.error("Stack trace:", error.stack);

    res
      .status(500)
      .json({ message: "An error occurred while generating the audit report" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
