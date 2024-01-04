import { ReactNode } from 'react';
import { Root, CollapsibleContent, CollapsibleTrigger, CollapsibleProps as CollapsiblePrimitiveProps } from '@radix-ui/react-collapsible';

const CollapsibleContainer = Root;

export { CollapsibleContainer, CollapsibleTrigger, CollapsibleContent };

interface CollapsibleProps extends CollapsiblePrimitiveProps {
  collapsibleTrigger?: ReactNode;
}

const Collapsible = ({ open = false, onOpenChange, collapsibleTrigger, children }: CollapsibleProps) => {
  return (
    <CollapsibleContainer open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger>{collapsibleTrigger}</CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </CollapsibleContainer>
  );
};

export default Collapsible;
