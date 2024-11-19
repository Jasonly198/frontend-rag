import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ChatView } from 'src/sections/blank/chatroom';
// ----------------------------------------------------------------------

const metadata = { title: `Database Page - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChatView title="RAG Chatbot" />
    </>
  );
}
