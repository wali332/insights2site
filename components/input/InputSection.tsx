"use client";

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Columns3, Database, Eye, FileSpreadsheet, History, LoaderCircle, Upload, WandSparkles } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (text: string) => void;
  onUseCached?: () => void;
  hasCachedData?: boolean;
  loading: boolean;
}

interface CsvUploadState {
  fileName: string;
  rowCount: number;
  headers: string[];
  rows: string[][];
  selectedColumnIndex: number;
  savedToServer: boolean;
  error: string | null;
  saving: boolean;
}

const createEmptyUploadState = (): CsvUploadState => ({
  fileName: '',
  rowCount: 0,
  headers: [],
  rows: [],
  selectedColumnIndex: 0,
  savedToServer: false,
  error: null,
  saving: false,
});

const parseCsv = (csvText: string): string[][] => {
  const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let index = 0; index < normalizedText.length; index += 1) {
    const character = normalizedText[index];
    const nextCharacter = normalizedText[index + 1];

    if (inQuotes) {
      if (character === '"') {
        if (nextCharacter === '"') {
          currentCell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += character;
      }

      continue;
    }

    if (character === '"') {
      inQuotes = true;
      continue;
    }

    if (character === ',') {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if (character === '\n') {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += character;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);

  return rows.filter((row) => row.some((cell) => cell.trim().length > 0));
};

const normalizeCell = (value: string) => value.replace(/^\uFEFF/, '').trim();

const getFallbackColumnName = (index: number) => `Column ${index + 1}`;

const extractReviews = (upload: CsvUploadState) => {
  return upload.rows
    .map((row) => normalizeCell(row[upload.selectedColumnIndex] ?? ''))
    .filter((review) => review.length > 0);
};

const buildPipelineText = (productUpload: CsvUploadState) => {
  const productReviews = extractReviews(productUpload);

  return `Your Product Reviews:\n${productReviews.join('\n')}`;
};

const saveCsvToServer = async (csvText: string) => {
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: csvText }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || 'Failed to save the uploaded CSV');
  }
};

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, onUseCached, hasCachedData = false, loading }) => {
  const [productUpload, setProductUpload] = useState<CsvUploadState>(createEmptyUploadState());
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFileUpload = (file: File | undefined) => {
    if (!file) {
      return;
    }

    setSubmitError(null);
    setProductUpload((currentState) => ({
      ...currentState,
      error: null,
      saving: true,
      savedToServer: false,
    }));

    const reader = new FileReader();

    reader.onload = async () => {
      const csvText = typeof reader.result === 'string' ? reader.result : '';

      try {
        const parsedRows = parseCsv(csvText);

        if (parsedRows.length < 2) {
          throw new Error('CSV needs at least one header row and one data row.');
        }

        const headers = parsedRows[0].map((header) => normalizeCell(header));

        if (headers.length === 0) {
          throw new Error('CSV is missing columns.');
        }

        const dataRows = parsedRows.slice(1).filter((row) => row.some((cell) => normalizeCell(cell).length > 0));

        if (dataRows.length === 0) {
          throw new Error('CSV has no review rows.');
        }

        const nextState: CsvUploadState = {
          fileName: file.name,
          rowCount: dataRows.length,
          headers,
          rows: dataRows,
          selectedColumnIndex: Math.max(headers.length - 1, 0),
          savedToServer: false,
          error: null,
          saving: true,
        };

        setProductUpload(nextState);
        await saveCsvToServer(csvText);

        setProductUpload({
          ...nextState,
          saving: false,
          savedToServer: true,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to read the CSV file.';

        setProductUpload({
          ...createEmptyUploadState(),
          fileName: file.name,
          error: message,
        });
      }
    };

    reader.onerror = () => {
      setProductUpload({
        ...createEmptyUploadState(),
        fileName: file.name,
        error: 'Unable to read the CSV file.',
      });
    };

    reader.readAsText(file);
  };

  const updateSelectedColumn = (selectedColumnIndex: number) => {
    setProductUpload((currentState) => ({
      ...currentState,
      selectedColumnIndex,
      error: null,
    }));
  };

  const handleGenerate = () => {
    if (!productUpload.rows.length) {
      setSubmitError('Upload your product CSV before generating the landing page.');
      return;
    }

    const productReviews = extractReviews(productUpload);

    if (!productReviews.length) {
      setSubmitError('The selected review column is empty.');
      return;
    }

    setSubmitError(null);
    onGenerate(buildPipelineText(productUpload));
  };

  const renderUploadCard = (title: string, description: string, upload: CsvUploadState) => {
    const reviewPreview = extractReviews(upload).slice(0, 3);
    const hasLoadedFile = upload.fileName.length > 0;
    const columns = upload.headers.length > 0 ? upload.headers : [];

    return (
      <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>

          {hasLoadedFile ? (
            <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {upload.rowCount} rows
            </div>
          ) : null}
        </div>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          <span className="inline-flex items-center gap-1.5"><Upload className="h-4 w-4" />Upload CSV</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => handleFileUpload(event.target.files?.[0])}
            disabled={loading}
            className="mt-2 block w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-inner file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        {upload.saving ? (
          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <LoaderCircle className="mr-2 inline-block h-4 w-4 animate-spin" />
            Saving CSV to uploads folder...
          </div>
        ) : null}

        {upload.error ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {upload.error}
          </div>
        ) : null}

        {hasLoadedFile && !upload.error ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <div className="font-semibold text-gray-900">{upload.fileName}</div>
              <div>{upload.rowCount} review rows parsed successfully.</div>
              {upload.savedToServer ? <div className="text-gray-700">Saved to public/uploads.</div> : null}
            </div>

            <label className="block text-sm font-medium text-gray-700">
              <span className="inline-flex items-center gap-1.5"><Columns3 className="h-4 w-4" />Review text column</span>
              <select
                value={upload.selectedColumnIndex}
                onChange={(event) => updateSelectedColumn(Number(event.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {columns.map((columnName, index) => (
                  <option key={`product-${index}`} value={index}>
                    {columnName || getFallbackColumnName(index)}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 text-sm font-semibold text-gray-900 inline-flex items-center gap-1.5"><Eye className="h-4 w-4" />Preview of extracted reviews</div>
              {reviewPreview.length > 0 ? (
                <ol className="space-y-2 text-sm text-gray-600">
                  {reviewPreview.map((review, index) => (
                    <li key={`product-preview-${index}`} className="rounded-lg bg-gray-50 px-3 py-2">
                      {review}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-500">Select a different column to find the review text.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Card className="mb-8 overflow-hidden relative border border-gray-200 bg-white/80 backdrop-blur-xl shadow-xl">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gray-200 mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 inline-flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-gray-700" />1. Upload Your Product Reviews CSV</h2>
            <p className="mt-1 text-sm text-gray-500">Client-side CSV parsing, column selection, and a preview of the extracted review text.</p>
          </div>
          <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
            <span className="inline-flex items-center gap-1"><Database className="h-3.5 w-3.5" />Quotes and commas supported</span>
          </div>
        </div>

        {renderUploadCard('Your Product Reviews CSV', 'Upload the raw customer feedback file for your own product.', productUpload)}

        {submitError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        ) : null}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
          {onUseCached ? (
            <Button
              variant="secondary"
              onClick={onUseCached}
              disabled={!hasCachedData || loading}
            >
              <span className="inline-flex items-center gap-1.5"><History className="h-4 w-4" />Use Cached JSON (Temp)</span>
            </Button>
          ) : null}

          <Button 
            onClick={handleGenerate} 
            disabled={!productUpload.rows.length || loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing CSV reviews...
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5"><WandSparkles className="h-4 w-4" />Generate Website</span>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
