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
  const [numPages, setNumPages] = useState(0);
  const [pages, setPages] = useState<ReactNode[]>([]);

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
    <div
      className={styles.pdfViewer}
      style={{ height: props.height }}
      data-testid={props.testId}>
      <Document className={styles.pdf}
        file={props.documentUrl}
        onLoadSuccess={onDocumentLoadSuccess}>
        { pages }
      </Document>
    </div>
  );
};

export default PdfViewer;
