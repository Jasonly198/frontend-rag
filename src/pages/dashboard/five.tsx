import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// import { BlankView } from 'src/sections/blank/view';
import { ChatView } from 'src/sections/blank/chatroom';
import { CHARSET } from 'stylis';

// ----------------------------------------------------------------------

const metadata = { title: `Page five | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChatView title="RAG Chatbot 5" />
    </>
  );
}
