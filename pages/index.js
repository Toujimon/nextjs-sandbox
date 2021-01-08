import Link from "next/link";
import MainLayout from "../components/mainLayout";

export default function IndexPage() {
  return (
    <MainLayout>
      Hello World.
      <p>So this is NextJs, huh?</p>
      <p>For the moment this is pure static content</p>
    </MainLayout>
  );
}
