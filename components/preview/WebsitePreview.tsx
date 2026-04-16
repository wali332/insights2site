import React, { useMemo, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Insight, Website } from '../../types';
import { generateTemplate, getTemplateName } from '../../utils/templates';
import { Download, Expand, Globe, MonitorSmartphone, X } from 'lucide-react';

interface WebsitePreviewProps {
  website: Website | null;
  tone?: string | null;
  insights?: Insight[];
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ website, tone }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const templateName = useMemo(() => getTemplateName(tone), [tone]);

  const templateHtml = useMemo(() => {
    if (!website) {
      return '';
    }

    return generateTemplate({ website, tone });
  }, [website, tone]);

  const handleDownload = () => {
    if (!templateHtml) {
      return;
    }

    const blob = new Blob([templateHtml], { type: 'text/html;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = downloadUrl;
    anchor.download = 'website.html';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1500);
  };

  if (!website) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/40 border-dashed border-2 min-h-[600px]">
        <div className="w-24 h-24 mb-6 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-200 shadow-inner text-gray-700">
          <Globe className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">HTML Website Preview</h3>
        <p className="text-gray-500 max-w-sm">No website payload available for rendering yet.</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full flex flex-col gap-4 bg-white/70 border border-gray-200 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 border-b border-gray-200 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 mb-2 inline-flex items-center gap-1.5"><MonitorSmartphone className="h-3.5 w-3.5" />HTML Preview</div>
            <h2 className="text-xl font-bold text-gray-900">{templateName}</h2>
            <p className="text-sm text-gray-500 mt-1">Final rendered page. You can preview in fullscreen and export full HTML.</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => setIsFullscreen(true)}>
              <span className="inline-flex items-center gap-1.5"><Expand className="h-4 w-4" />Fullscreen Preview</span>
            </Button>
            <Button onClick={handleDownload} disabled={!templateHtml} className="whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5"><Download className="h-4 w-4" />Download Website</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-[640px] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          <iframe
            title="Generated HTML Preview"
            srcDoc={templateHtml}
            className="w-full h-full min-h-[640px] bg-white"
            sandbox="allow-same-origin allow-forms allow-popups allow-scripts"
          />
        </div>
      </Card>

      {isFullscreen ? (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm p-2 sm:p-4">
          <div className="h-full w-full rounded-2xl border border-gray-200 bg-white overflow-hidden flex flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Fullscreen HTML Preview</div>
                <div className="text-sm font-semibold text-gray-900">{templateName}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleDownload}><span className="inline-flex items-center gap-1.5"><Download className="h-4 w-4" />Download Website</span></Button>
                <Button onClick={() => setIsFullscreen(false)}><span className="inline-flex items-center gap-1.5"><X className="h-4 w-4" />Close</span></Button>
              </div>
            </div>
            <iframe
              title="Fullscreen Generated HTML Preview"
              srcDoc={templateHtml}
              className="w-full flex-1 bg-white"
              sandbox="allow-same-origin allow-forms allow-popups allow-scripts"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
