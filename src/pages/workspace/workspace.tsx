import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CONFIG } from 'src/config-global';
import { WorkspaceView } from 'src/sections/workspace/workspace';
// ----------------------------------------------------------------------

const metadata = { title: `File Management Page - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WorkspaceView title="Workspace" />
    </>
  );
}