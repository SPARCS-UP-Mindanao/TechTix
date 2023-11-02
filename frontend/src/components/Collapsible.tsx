import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const CollapsibleContainer = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { CollapsibleContainer, CollapsibleTrigger, CollapsibleContent };

interface CollapsibleProps extends CollapsiblePrimitive.CollapsibleProps {
  collapsibleTrigger?: React.ReactNode;
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
