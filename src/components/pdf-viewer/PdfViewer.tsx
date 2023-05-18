import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { Document, Page, pdfjs } from 'react-pdf';
import { ReactNode, useEffect, useState } from 'react';

import styles from './PdfViewer.module.less';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

interface Props {
  documentUrl: string,
  width: number,
  height: number,
  testId: string
}

const PdfViewer = (props: Props) => {
  const [numPages, setNumPages] = useState(null);
  const [pages, setPages] = useState<ReactNode[]>([]);

  /* This prevents pdf viewer from throwing errors when changing document url. */
  /* Github issue solution: https://github.com/wojtekmaj/react-pdf/issues/959#issuecomment-1163239179 */
  useEffect(() => {
    setNumPages(null);
  }, [props.documentUrl]);

  useEffect(() => {
    setPages(Array.from(
      new Array(numPages),
      (_, index) => (
        <Page
          className={styles.page}
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          width={props.width - 20}/>
      )
    ));
  }, [numPages, props.width]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className={styles.pdfViewer}
      style={{ height: props.height }}
      data-testid={props.testId}>
      <Document
        file={props.documentUrl}
        onLoadSuccess={onDocumentLoadSuccess}>
        { pages }
      </Document>
    </div>
  );
};

export default PdfViewer;
