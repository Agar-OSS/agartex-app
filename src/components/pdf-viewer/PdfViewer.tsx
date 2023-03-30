import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';

import styles from './PdfViewer.module.less';
import { useState } from 'react';

interface Props {
  width: number,
  height: number
}

const PdfViewer = (props: Props) => {
  const [numPages, setNumPages] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className={styles.root} style={{ height: props.height }}>
      <Document className={styles.pdf}
        file='example.pdf'
        onLoadSuccess={onDocumentLoadSuccess}
        options={{
          cMapUrl: 'cmaps/',
          cMapPacked: true,
        }}>
        {Array.from(
          new Array(numPages),
          (_, index) => (
            <Page
              className={styles.page}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={props.width - 20}/>))}
      </Document>
    </div>
  );
};

export default PdfViewer;
