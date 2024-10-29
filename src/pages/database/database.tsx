import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CONFIG } from 'src/config-global';
// ----------------------------------------------------------------------

const metadata = { title: `Database Page - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <Typography variant="body2" textAlign="center">Testing Database</Typography>
    </>
  );
}
