export const versionSatisfies = (versionAstr: string, versionBstr: string): boolean => {
  const parseVersion = (v: string) => {
    const [major, minor] = v.split('.').map(Number);
    return { major, minor };
  };
  const versionA = parseVersion(versionAstr);
  const versionB = parseVersion(versionBstr);
  return versionA.major === versionB.major;
}
