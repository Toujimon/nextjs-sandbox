import Link from "next/link";
import MainLayout from "../../components/mainLayout";

export default function AdventOfCode() {
  return (
    <MainLayout>
      <ul>
        <li>
          <Link href="/advent-of-code/2020">
            <a>Year 2020</a>
          </Link>
        </li>
        <li>
          <Link href="/advent-of-code/2019">
            <a>Year 2019</a>
          </Link>
        </li>
      </ul>
    </MainLayout>
  );
}
