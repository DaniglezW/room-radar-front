import HomeBody from "./components/HomeBody";
import SearchBar from "./components/SearchBar";


export default function Page() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <SearchBar />
      <HomeBody />
    </main>
  );
}
