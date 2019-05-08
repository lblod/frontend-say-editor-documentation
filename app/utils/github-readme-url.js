export default function githubReadmeUrl(repository, options = { branch: "master", format: "md" }) {
  const { branch, format } = options;
  return `https://raw.githubusercontent.com/${repository}/${branch}/README.${format}`;
}
