import React from 'react';
import { H1, P } from '../../component/Content';
import { Button } from '../../component/Button';
export default function GlobalErrorPage({ error, reset, children, }) {
    return (<div className="relative">
      <div className="px-16 flex flex-col gap-16 items-center">
        <H1 className="text-center">Error</H1>
        <P>Something went wrong!</P>
        <P className="whitespace-pre-wrap">{error.digest}</P>
        <div className="flex justify-center">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
      {children}
    </div>);
}
//# sourceMappingURL=GlobalErrorPage.jsx.map