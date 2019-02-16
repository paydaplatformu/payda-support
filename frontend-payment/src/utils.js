export const getPackageTag = (pack, langCode) =>
  (pack.tags && pack.tags.find(tag => tag.code === langCode.toUpperCase())) ||
  pack.defaultTag;

export const getPackageName = (pack, langCode) => {
  const packageTag = getPackageTag(pack, langCode);

  return packageTag.name;
};

export const getPackageNameAndDescription = (pack, langCode) => {
  const packageTag = getPackageTag(pack, langCode);

  return `${packageTag.name} - ${packageTag.description}`;
};
