import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const generateExcelData = (data) => {
    // Flattening data
    const flattenedData = data.map((item) => {
        const { _id, surveyId, submittedAt, answers } = item;
        return {
            _id,
            surveyId,
            submittedAt: new Date(submittedAt).toLocaleString(),
            ...answers, // Spread answers as individual columns
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey Responses');
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

export const downloadExcelFile = (data, fileName = 'survey_responses.xlsx') => {
    const excelData = generateExcelData(data);
    const blob = new Blob([excelData], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
};
