import * as React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-170 w-100% rounded-md border text-white  ">
      <div className="p-4 ">
        <h4 className=" mb-10 text-3xl leading-none font-medium">Student :</h4>
        {tags.map((student) => (
          <React.Fragment key={student}>
            <div
              className="m-3 text-2xl"
              onClick={() => {
                alert(student);
              }}
            >
              {student}
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
