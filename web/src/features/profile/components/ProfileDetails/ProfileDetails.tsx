import ProfileDetailsCard, {
  ProfileDetailsCardProps,
} from './ProfileDetailsCard';

function ProfileDetails({ cards }: { cards: ProfileDetailsCardProps[] }) {
  return (
    <div className="flex flex-col gap-4.5">
      {cards.map((card, index) => (
        <ProfileDetailsCard key={index} {...card} />
      ))}
    </div>
  );
}

export default ProfileDetails;
