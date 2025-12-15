import ProfilMesajlarClient from "@/components/profil/messages/ProfilMesajlarClient";

export default async function MesajlarPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  return (
    <div className="page-shell px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden pb-20 md:pb-6">
      <ProfilMesajlarClient initialConversationId={resolvedSearchParams.conversation as string | undefined} />
    </div>
  );
}

