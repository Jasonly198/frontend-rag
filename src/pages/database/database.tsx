import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import { DatabaseChoiceView } from 'src/sections/database/databaseChoose';
import { CONFIG } from 'src/config-global';
// ----------------------------------------------------------------------

const metadata = { title: `Database Page - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DatabaseChoiceView title="Which database are we going to use today?" />
    </>
  );
}
