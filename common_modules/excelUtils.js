const XLSX = require('xlsx');

function readTestDataFromExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

module.exports = { readTestDataFromExcel };
