import React from 'react';

const ConditionalFragment: FC<{ condition?: boolean }> = ({
  condition = true,
  children,
}) => {
  if (!condition) return null;
  return <React.Fragment>{children}</React.Fragment>;
};

export default ConditionalFragment;
