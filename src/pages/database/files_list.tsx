import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { FileListView } from 'src/sections/file/fileList';

// ----------------------------------------------------------------------

const metadata = { title: `PageFile test | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <FileListView title="FileList" />
    </>
  );
}
