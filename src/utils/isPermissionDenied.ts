// This function will return 'true' when the specified permission has been denied by the user.
// If the API doesn't exist, or the query function returns an error, 'false' will be returned.
export async function isPermissionDenied(name: "camera" | "microphone") {
  const permissionName = name as PermissionName; // workaround for https://github.com/microsoft/TypeScript/issues/33923

  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({
        name: permissionName,
      });
      return result.state === "denied";
    } catch {
      return false;
    }
  } else {
    return false;
  }
}
