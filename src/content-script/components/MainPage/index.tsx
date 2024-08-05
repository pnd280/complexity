import NewVersionAnnouncer from "@/content-script/components/MainPage/NewVersionAnnouncer";
import Slogan from "@/content-script/components/MainPage/Slogan";

export default function MainPage() {
  return (
    <>
      <Slogan />
      <NewVersionAnnouncer />
    </>
  );
}
