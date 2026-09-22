import { PageHeader } from "@/components/ui/PageHeader";
import { OccasionTilesManager } from "@/components/occasions/OccasionTilesManager";
import { listOccasionTiles } from "@/lib/data/occasion-tiles";

export default async function OccasionsPage() {
  const tiles = await listOccasionTiles();

  return (
    <>
      <PageHeader
        title="Shop by Occasion"
        description="Cover image and blurb for each occasion tile on the shop's home page. An occasion with no image here is skipped there, not shown as a placeholder."
      />
      <OccasionTilesManager tiles={tiles} />
    </>
  );
}
