import { type ReactNode, useState } from "react";

import { DisclosureButton } from "@/components/common/DisclosureButton";

type Props = {
  title: string;
  children: ReactNode;
};

export function FormInputsToggle({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <DisclosureButton
        title={title}
        isOpen={isOpen}
        onToggle={() => setIsOpen((previous) => !previous)}
      />
      {isOpen && children}
    </div>
  );
}
