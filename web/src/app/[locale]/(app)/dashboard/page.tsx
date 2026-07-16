import TopBar from '@/features/app/components/TopBar/TopBar';
import Content from '@/features/app/layouts/Content/Content';
import VocabListPanel, {
  vocablistsData,
} from '@/features/dashboard/VocabListPanel/VocabListPanel';

interface PageProps {
  params: { dashboard: string };
}

function page({ params }: PageProps) {
  const { dashboard } = params;

  return (
    <>
      <TopBar path={dashboard} title="Overview" />
      <Content>
        <VocabListPanel
          data={vocablistsData}
          title="Resume practice"
          buttonLinkLabel="All lists"
        />
      </Content>
    </>
  );
}

export default page;
