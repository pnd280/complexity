export const onlyMainWorldGuard = () => {
  if (!isMainWorldContext())
    throw new Error(
      "This script should only be executed in main world context",
    );
};

export const onlyExtensionGuard = () => {
  if (!isExtensionContext())
    throw new Error("This script should only be executed in extension context");
};
