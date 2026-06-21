import AwfullyWeird from "./AwfullyWeird";

export default function Page(props) {
  return (
    <AwfullyWeird /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
    {...props} />
  );
}
