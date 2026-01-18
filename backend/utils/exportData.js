const Expense = require("../models/Expense");
const Category = require("../models/Category");
const Budget = require("../models/Budget");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const XLSX = require("xlsx");
const moment = require("moment");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Enhanced file naming utility
const generateFileName = (
  type,
  theme = "default",
  period = null,
  format = "",
) => {
  const timestamp = moment().format("YYYY-MM-DD-HHmmss");
  const periodSuffix = period ? `-${period}` : "";
  const themeSuffix = theme !== "default" ? `-${theme}` : "";

  const baseNames = {
    csv: `expens es${periodSuffix}${themeSuffix}-${timestamp}`,
    json: `expenses-data${periodSuffix}${themeSuffix}-${timestamp}`,
    excel: `expenses${periodSuffix}${themeSuffix}-${timestamp}`,
    pdf: `expenses-report${periodSuffix}${themeSuffix}-${timestamp}`,
    financial: `financial-report${periodSuffix}${themeSuffix}-${timestamp}`,
  };

  return baseNames[type] || `export-${timestamp}`;
};

// Enhanced theme configurations
const exportThemes = {
  default: {
    colors: {
      primary: "#3B82F6",
      secondary: "#6B7280",
      success: "#10B981",
      danger: "#EF4444",
      warning: "#F59E0B",
      dark: "#1F2937",
    },
    fonts: {
      header: "Helvetica-Bold",
      body: "Helvetica",
      mono: "Courier",
    },
  },
  professional: {
    colors: {
      primary: "#1E40AF",
      secondary: "#4B5563",
      success: "#047857",
      danger: "#DC2626",
      warning: "#D97706",
      dark: "#111827",
    },
    fonts: {
      header: "Helvetica-Bold",
      body: "Helvetica",
      mono: "Courier-Bold",
    },
  },
  modern: {
    colors: {
      primary: "#7C3AED",
      secondary: "#6B7280",
      success: "#059669",
      danger: "#DC2626",
      warning: "#EA580C",
      dark: "#1F2937",
    },
    fonts: {
      header: "Helvetica-Bold",
      body: "Helvetica",
      mono: "Courier",
    },
  },
  minimal: {
    colors: {
      primary: "#000000",
      secondary: "#6B7280",
      success: "#000000",
      danger: "#000000",
      warning: "#000000",
      dark: "#000000",
    },
    fonts: {
      header: "Helvetica-Bold",
      body: "Helvetica",
      mono: "Courier",
    },
  },
};

const exportToCSV = async (userId, filters = {}, options = {}) => {
  try {
    const { theme = "default", includeSummary = true } = options;

    let filter = { user: userId };

    if (filters.type) filter.type = filters.type;
    if (filters.category) filter.category = filters.category;

    if (filters.startDate || filters.endDate) {
      filter.date = {};
      if (filters.startDate) filter.date.$gte = new Date(filters.startDate);
      if (filters.endDate) filter.date.$lte = new Date(filters.endDate);
    }

    if (filters.search) {
      filter.description = { $regex: filters.search, $options: "i" };
    }

    const expenses = await Expense.find(filter)
      .populate("category", "name color type")
      .sort({ date: -1 });

    // Calculate summary data
    const summary = {
      totalIncome: expenses
        .filter((e) => e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0),
      totalExpenses: expenses
        .filter((e) => e.type === "expense")
        .reduce((sum, e) => sum + e.amount, 0),
      netAmount: 0,
      totalRecords: expenses.length,
    };
    summary.netAmount = summary.totalIncome - summary.totalExpenses;

    const csvData = expenses.map((expense) => ({
      Date: moment(expense.date).format("YYYY-MM-DD"),
      Description: expense.description,
      Category: expense.category.name,
      Type: expense.type.charAt(0).toUpperCase() + expense.type.slice(1),
      Amount: expense.amount,
      "Amount Formatted": `${expense.type === "expense" ? "-" : ""}$${expense.amount.toFixed(2)}`,
      Tags: expense.tags ? expense.tags.join(", ") : "",
      "Created At": moment(expense.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    }));

    let csvContent = "";

    // Add summary section if requested
    if (includeSummary) {
      csvContent += `EXPENSE TRACKER EXPORT - ${moment().format("MMMM Do YYYY, h:mm:ss A")}\n`;
      csvContent += `Total Records: ${summary.totalRecords}\n`;
      csvContent += `Total Income: $${summary.totalIncome.toFixed(2)}\n`;
      csvContent += `Total Expenses: $${summary.totalExpenses.toFixed(2)}\n`;
      csvContent += `Net Amount: $${summary.netAmount.toFixed(2)}\n\n`;

      if (Object.keys(filters).length > 0) {
        csvContent += "FILTERS APPLIED:\n";
        if (filters.startDate && filters.endDate) {
          csvContent += `Date Range: ${moment(filters.startDate).format("MMM D, YYYY")} - ${moment(filters.endDate).format("MMM D, YYYY")}\n`;
        }
        if (filters.type) {
          csvContent += `Type: ${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}\n`;
        }
        if (filters.search) {
          csvContent += `Search: "${filters.search}"\n`;
        }
        csvContent += "\n";
      }
      csvContent += "TRANSACTION DATA:\n";
    }

    const fields = [
      "Date",
      "Description",
      "Category",
      "Type",
      "Amount",
      "Amount Formatted",
      "Tags",
      "Created At",
    ];

    const json2csvParser = new Parser({ fields });
    csvContent += json2csvParser.parse(csvData);

    const period = filters.startDate && filters.endDate ? "custom" : "all";
    const filename = `${generateFileName("csv", theme, period)}.csv`;

    return {
      success: true,
      data: csvContent,
      filename: filename,
      contentType: "text/csv",
      metadata: {
        exportType: "csv",
        theme: theme,
        recordCount: expenses.length,
        exportDate: moment().format(),
        filters: filters,
      },
    };
  } catch (error) {
    console.error("CSV Export Error:", error);
    throw new Error("Failed to export data to CSV");
  }
};

const exportToExcel = async (userId, filters = {}, options = {}) => {
  try {
    const { theme = "default", includeSummary = true } = options;

    let filter = { user: userId };

    if (filters.type) filter.type = filters.type;
    if (filters.category) filter.category = filters.category;

    if (filters.startDate || filters.endDate) {
      filter.date = {};
      if (filters.startDate) filter.date.$gte = new Date(filters.startDate);
      if (filters.endDate) filter.date.$lte = new Date(filters.endDate);
    }

    if (filters.search) {
      filter.description = { $regex: filters.search, $options: "i" };
    }

    const expenses = await Expense.find(filter)
      .populate("category", "name color type")
      .sort({ date: -1 });

    // Calculate summary data
    const summary = {
      totalIncome: expenses
        .filter((e) => e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0),
      totalExpenses: expenses
        .filter((e) => e.type === "expense")
        .reduce((sum, e) => sum + e.amount, 0),
      netAmount: 0,
      totalRecords: expenses.length,
    };
    summary.netAmount = summary.totalIncome - summary.totalExpenses;

    // Prepare data for Excel
    const excelData = expenses.map((expense) => ({
      Date: moment(expense.date).format("YYYY-MM-DD"),
      Description: expense.description,
      Category: expense.category.name,
      Type: expense.type.charAt(0).toUpperCase() + expense.type.slice(1),
      Amount: expense.amount,
      "Amount Formatted": `${expense.type === "expense" ? "-" : ""}$${expense.amount.toFixed(2)}`,
      Tags: expense.tags ? expense.tags.join(", ") : "",
      "Created At": moment(expense.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Summary sheet
    if (includeSummary) {
      const summaryData = [
        ["EXPENSE TRACKER EXPORT"],
        ["Generated on:", moment().format("MMMM Do YYYY, h:mm:ss A")],
        [""],
        ["SUMMARY"],
        ["Total Records:", summary.totalRecords],
        ["Total Income:", `$${summary.totalIncome.toFixed(2)}`],
        ["Total Expenses:", `$${summary.totalExpenses.toFixed(2)}`],
        ["Net Amount:", `$${summary.netAmount.toFixed(2)}`],
        [""],
      ];

      if (Object.keys(filters).length > 0) {
        summaryData.push(["FILTERS APPLIED:"]);
        if (filters.startDate && filters.endDate) {
          summaryData.push([
            "Date Range:",
            `${moment(filters.startDate).format("MMM D, YYYY")} - ${moment(filters.endDate).format("MMM D, YYYY")}`,
          ]);
        }
        if (filters.type) {
          summaryData.push([
            "Type:",
            filters.type.charAt(0).toUpperCase() + filters.type.slice(1),
          ]);
        }
        if (filters.search) {
          summaryData.push(["Search:", `"${filters.search}"`]);
        }
      }

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    }

    // Data sheet
    const wsData = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, wsData, "Transactions");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const period = filters.startDate && filters.endDate ? "custom" : "all";
    const filename = `${generateFileName("excel", theme, period)}.xlsx`;

    return {
      success: true,
      data: buffer,
      filename: filename,
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      metadata: {
        exportType: "excel",
        theme: theme,
        recordCount: expenses.length,
        exportDate: moment().format(),
        filters: filters,
      },
    };
  } catch (error) {
    console.error("Excel Export Error:", error);
    throw new Error("Failed to export data to Excel");
  }
};

const exportToPDF = async (userId, filters = {}, options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        theme = "default",
        includeCharts = false,
        paperSize = "A4",
      } = options;
      const themeConfig = exportThemes[theme] || exportThemes.default;

      let filter = { user: userId };

      if (filters.type) filter.type = filters.type;
      if (filters.category) filter.category = filters.category;

      if (filters.startDate || filters.endDate) {
        filter.date = {};
        if (filters.startDate) filter.date.$gte = new Date(filters.startDate);
        if (filters.endDate) filter.date.$lte = new Date(filters.endDate);
      }

      if (filters.search) {
        filter.description = { $regex: filters.search, $options: "i" };
      }

      const expenses = await Expense.find(filter)
        .populate("category", "name color type")
        .sort({ date: -1 });

      let aggregateFilter = { user: new mongoose.Types.ObjectId(userId) };
      if (filters.type) aggregateFilter.type = filters.type;
      if (filters.category)
        aggregateFilter.category = new mongoose.Types.ObjectId(
          filters.category,
        );
      if (filter.date) aggregateFilter.date = filter.date;
      if (filter.description) aggregateFilter.description = filter.description;

      const summary = await Expense.aggregate([
        { $match: aggregateFilter },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      const incomeSummary = summary.find((s) => s._id === "income") || {
        total: 0,
        count: 0,
      };
      const expenseSummary = summary.find((s) => s._id === "expense") || {
        total: 0,
        count: 0,
      };
      const netAmount = incomeSummary.total - expenseSummary.total;

      const doc = new PDFDocument({
        margin: 50,
        size: paperSize,
        info: {
          Title: `Expense Report - ${theme} Theme`,
          Author: "Expense Tracker",
          Subject: "Financial Export",
          Keywords: "expenses, report, financial",
          CreationDate: new Date(),
        },
      });

      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        const period = filters.startDate && filters.endDate ? "custom" : "all";
        const filename = `${generateFileName("pdf", theme, period)}.pdf`;

        resolve({
          success: true,
          data: result,
          filename: filename,
          contentType: "application/pdf",
          metadata: {
            exportType: "pdf",
            theme: theme,
            paperSize: paperSize,
            recordCount: expenses.length,
            exportDate: moment().format(),
          },
        });
      });

      addContentToPDF(doc, expenses, {
        filters,
        incomeSummary,
        expenseSummary,
        netAmount,
        totalRecords: expenses.length,
        theme: themeConfig,
        includeCharts,
      });

      doc.end();
    } catch (error) {
      console.error("PDF Export Error:", error);
      reject(new Error("Failed to export data to PDF"));
    }
  });
};

const addContentToPDF = (doc, expenses, summary) => {
  const {
    filters,
    incomeSummary,
    expenseSummary,
    netAmount,
    totalRecords,
    theme,
    includeCharts,
  } = summary;

  // Header with theme colors
  doc
    .fillColor(theme.colors.primary)
    .fontSize(20)
    .font(theme.fonts.header)
    .text("Expense Tracker Report", 50, 50);

  doc
    .fillColor(theme.colors.secondary)
    .fontSize(10)
    .font(theme.fonts.body)
    .text(
      `Generated on: ${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
      50,
      75,
    );

  // Export theme badge
  doc.fillColor(theme.colors.primary).rect(400, 45, 100, 20).fill();

  doc
    .fillColor("#FFFFFF") // White text for badge
    .fontSize(8)
    .font(theme.fonts.header)
    .text(
      `THEME: ${Object.keys(exportThemes).find((key) => exportThemes[key] === theme) || "DEFAULT"}`,
      405,
      52,
      { width: 90, align: "center" },
    );

  let currentY = 110;

  // Filters section
  if (Object.keys(filters).length > 0) {
    doc
      .fillColor(theme.colors.dark)
      .fontSize(12)
      .font(theme.fonts.header)
      .text("Filters Applied:", 50, currentY);

    currentY += 20;
    doc.fontSize(9).font(theme.fonts.body);

    if (filters.startDate && filters.endDate) {
      doc
        .fillColor(theme.colors.secondary)
        .text(
          `Date Range: ${moment(filters.startDate).format("MMM D, YYYY")} - ${moment(filters.endDate).format("MMM D, YYYY")}`,
          70,
          currentY,
        );
      currentY += 15;
    }

    if (filters.type) {
      doc.text(
        `Type: ${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}`,
        70,
        currentY,
      );
      currentY += 15;
    }

    if (filters.search) {
      doc.text(`Search: "${filters.search}"`, 70, currentY);
      currentY += 15;
    }

    currentY += 10;
  }

  // Enhanced Summary section with colored boxes
  const summaryBoxY = currentY;

  // Income box (Green)
  doc.fillColor(theme.colors.success).rect(50, summaryBoxY, 160, 80).fill();

  // Expenses box (Blue)
  doc.fillColor(theme.colors.primary).rect(220, summaryBoxY, 160, 80).fill();

  // Net Amount box - Dynamic color based on value
  const netBoxColor =
    netAmount >= 0 ? theme.colors.success : theme.colors.danger;
  doc.fillColor(netBoxColor).rect(390, summaryBoxY, 160, 80).fill();

  // Summary text - ALL TEXT IN WHITE FOR CONTRAST
  doc
    .fillColor("#FFFFFF") // Always white text for contrast on colored backgrounds
    .fontSize(10)
    .font(theme.fonts.header);

  // Income (White text on green background)
  doc.text("TOTAL INCOME", 60, summaryBoxY + 10);
  doc
    .fontSize(12)
    .text(`$${incomeSummary.total.toFixed(2)}`, 60, summaryBoxY + 25);
  doc
    .fontSize(8)
    .text(`${incomeSummary.count} transactions`, 60, summaryBoxY + 40);

  // Expenses (White text on blue background)
  doc.text("TOTAL EXPENSES", 230, summaryBoxY + 10);
  doc
    .fontSize(12)
    .text(`$${expenseSummary.total.toFixed(2)}`, 230, summaryBoxY + 25);
  doc
    .fontSize(8)
    .text(`${expenseSummary.count} transactions`, 230, summaryBoxY + 40);

  // Net Amount (White text on green/red background)
  doc.text("NET AMOUNT", 400, summaryBoxY + 10);
  doc.fontSize(12).text(`$${netAmount.toFixed(2)}`, 400, summaryBoxY + 25);
  doc.fontSize(8).text(`${totalRecords} total records`, 400, summaryBoxY + 40);

  currentY = summaryBoxY + 100;

  // Add a small net amount indicator with better visibility
  doc
    .fillColor(netAmount >= 0 ? theme.colors.success : theme.colors.danger)
    .fontSize(11)
    .font(theme.fonts.header)
    .text(
      `Net Amount: ${netAmount >= 0 ? "+" : ""}$${netAmount.toFixed(2)}`,
      50,
      currentY,
    );

  currentY += 20;

  // Transactions table
  addExpensesTable(doc, expenses, currentY, theme);
};

const addExpensesTable = (doc, expenses, startY, theme) => {
  const tableTop = startY;
  const rowHeight = 20;
  const pageWidth = doc.page.width - 100;
  const colWidths = [70, 160, 90, 70, 60]; // Adjusted widths for better layout

  // Table header with theme
  doc.fillColor(theme.colors.primary).fontSize(10).font(theme.fonts.header);

  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  let x = 50;

  headers.forEach((header, i) => {
    doc.text(header, x, tableTop, { width: colWidths[i], align: "left" });
    x += colWidths[i];
  });

  // Table rows
  doc.fontSize(9).font(theme.fonts.body);
  let y = tableTop + rowHeight;

  expenses.forEach((expense, index) => {
    if (y > doc.page.height - 100) {
      doc.addPage();
      y = 50;
      doc.fillColor(theme.colors.primary).fontSize(10).font(theme.fonts.header);
      x = 50;
      headers.forEach((header, i) => {
        doc.text(header, x, y, { width: colWidths[i], align: "left" });
        x += colWidths[i];
      });
      y += rowHeight;
      doc.fontSize(9).font(theme.fonts.body);
    }

    // Alternate row background
    if (index % 2 === 0) {
      doc
        .fillColor("#F9FAFB")
        .rect(50, y - 5, pageWidth, rowHeight)
        .fill();
    }

    x = 50;
    doc
      .fillColor(theme.colors.secondary)
      .text(moment(expense.date).format("MMM D, YY"), x, y, {
        width: colWidths[0],
        align: "left",
      });
    x += colWidths[0];

    doc.text(expense.description, x, y, { width: colWidths[1], align: "left" });
    x += colWidths[1];

    doc.text(expense.category.name, x, y, {
      width: colWidths[2],
      align: "left",
    });
    x += colWidths[2];

    const typeColor =
      expense.type === "income" ? theme.colors.success : theme.colors.danger;
    doc
      .fillColor(typeColor)
      .text(
        expense.type.charAt(0).toUpperCase() + expense.type.slice(1),
        x,
        y,
        { width: colWidths[3], align: "left" },
      );
    x += colWidths[3];

    const amountText = `$${expense.amount.toFixed(2)}`;
    doc
      .fillColor(
        expense.type === "income" ? theme.colors.success : theme.colors.danger,
      )
      .text(amountText, x, y, { width: colWidths[4], align: "right" });

    y += rowHeight;
  });
};

// Enhanced financial report with themes
const exportFinancialReport = async (
  userId,
  period = "month",
  options = {},
) => {
  try {
    const { theme = "default", includeAnalysis = true } = options;

    const currentDate = new Date();
    let startDate, endDate;

    switch (period) {
      case "week":
        startDate = moment().startOf("week").toDate();
        endDate = moment().endOf("week").toDate();
        break;
      case "month":
        startDate = moment().startOf("month").toDate();
        endDate = moment().endOf("month").toDate();
        break;
      case "quarter":
        startDate = moment().startOf("quarter").toDate();
        endDate = moment().endOf("quarter").toDate();
        break;
      case "year":
        startDate = moment().startOf("year").toDate();
        endDate = moment().endOf("year").toDate();
        break;
      default:
        startDate = moment().startOf("month").toDate();
        endDate = moment().endOf("month").toDate();
    }

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("category", "name color type");

    const filename = `${generateFileName("financial", theme, period)}.json`;

    return {
      success: true,
      data: JSON.stringify(report, null, 2),
      filename: filename,
      contentType: "application/json",
      metadata: {
        exportType: "financial_report",
        theme: theme,
        period: period,
        recordCount: expenses.length,
        exportDate: moment().format(),
      },
    };
  } catch (error) {
    console.error("Financial Report Export Error:", error);
    throw new Error("Failed to generate financial report");
  }
};

// New: Get available themes
const getExportThemes = () => {
  return Object.keys(exportThemes).map((key) => ({
    name: key,
    displayName: key.charAt(0).toUpperCase() + key.slice(1),
    colors: exportThemes[key].colors,
  }));
};

module.exports = {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  exportFinancialReport,
  getExportThemes,
  exportThemes,
};
