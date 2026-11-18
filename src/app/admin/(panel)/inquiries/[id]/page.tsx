import { InquiryDetail } from "@/components/admin/inquiry-detail";

export default async function Page({ params }: PageProps<"/admin/inquiries/[id]">) {
  const { id } = await params;
  return <InquiryDetail id={id} />;
}
