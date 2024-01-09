import { Header } from "@/widgets/header/ui";
import { Translator } from "@/widgets/translator/ui";

export default function Home() {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="content-box w-[70vw]">
        <Header></Header>
        <Translator></Translator>
      </div>
    </div>
  );
}
