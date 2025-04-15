import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Página 404 não encontrada!</h1>

      <Link href="/">Voltar para home</Link>
    </div>
  );
}
