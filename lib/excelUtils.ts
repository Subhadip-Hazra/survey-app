import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface SurveyAnswer {
    [key: string]: string | number | boolean | null; // Represents possible types for survey answers
}

interface SurveyResponse {
    _id: string;
    surveyId: string;
    submittedAt: string | Date;
    answers: SurveyAnswer;
}

export const generateExcelData = (data: SurveyResponse[]): ArrayBuffer => {
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

interface DownloadExcelFileOptions {
    data: SurveyResponse[];
    fileName?: string;
}

export const downloadExcelFile = (data: DownloadExcelFileOptions['data'], fileName: DownloadExcelFileOptions['fileName'] = 'survey_responses.xlsx'): void => {
    const excelData = generateExcelData(data);
    const blob = new Blob([excelData], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
};
